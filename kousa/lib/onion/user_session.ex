defmodule Onion.UserSession do
  use GenServer, restart: :temporary
  alias Kousa.Utils.RegUtils

  # TODO: change this
  defmodule State do
    @type t :: %__MODULE__{
            user_id: String.t(),
            avatar_url: String.t(),
            username: String.t(),
            display_name: String.t(),
            current_room_id: String.t(),
            muted: boolean(),
            pid: pid()
          }

    defstruct user_id: nil,
              current_room_id: nil,
              muted: false,
              pid: nil,
              username: nil,
              display_name: nil,
              avatar_url: nil
  end

  #################################################################################
  # REGISTRY AND SUPERVISION BOILERPLATE

  defp via(user_id), do: {:via, Registry, {Onion.UserSessionRegistry, user_id}}

  defp cast(user_id, params), do: GenServer.cast(via(user_id), params)
  defp call(user_id, params), do: GenServer.call(via(user_id), params)

  def start_supervised(%State{} = state, options) do
    DynamicSupervisor.start_child(
      Onion.UserSessionDynamicSupervisor,
      {__MODULE__, [state, options]}
    )
  end

  def child_spec(init = [state, _opts]), do: %{super(init) | id: state.user_id}

  def count, do: Registry.count(Onion.UserSessionRegistry)

  ###############################################################################
  ## INITIALIZATION BOILERPLATE

  def start_link([state, _opts] = init) do
    GenServer.start_link(__MODULE__, init, name: via(state.user_id))
  end

  def init([state, opts]) do
    # transfer callers into the running process.
    Process.put(:"$callers", Keyword.get(opts, :callers, []))
    {:ok, state}
  end

  ##############################################################################
  ## API HOOKS
  ## TODO: CHANGE CASTS TO CALLS

  def set(user_id, key, value), do: cast(user_id, {:set, key, value})

  defp set_impl(key, value, state) do
    {:noreply, Map.put(state, key, value)}
  end

  def send_ws_msg(user_id, platform, msg), do: cast(user_id, {:send_ws_msg, platform, msg})

  defp send_ws_msg_impl(_platform, msg, state = %{pid: pid}) do
    # TODO: refactor this to not use ws-datastructures
    if pid, do: send(pid, {:remote_send, msg})
    {:noreply, state}
  end

  def set_mute(user_id, value) when is_boolean(value),
    do: cast(user_id, {:set_mute, value})

  defp set_mute_impl(value, state = %{current_room_id: current_room_id}) do
    if current_room_id do
      Kousa.Utils.RegUtils.lookup_and_cast(
        Onion.RoomSession,
        current_room_id,
        {:mute, state.user_id, value}
      )
    end

    {:noreply, %{state | muted: value}}
  end

  def new_tokens(user_id, tokens), do: cast(user_id, {:new_tokens, tokens})

  defp new_tokens_impl(tokens, state = %{pid: pid}) do
    # TODO: refactor this to not use ws-datastructures
    if pid, do: send(pid, {:remote_send, %{op: "new-tokens", d: tokens}})
    {:noreply, state}
  end

  def set_state(user_id, info), do: cast(user_id, {:set_state, info})

  defp set_state_impl(info, state) do
    {:noreply, Map.merge(state, info)}
  end

  def set_current_room_id(user_id, current_room_id) do
    set_state(user_id, %{current_room_id: current_room_id})
  end

  def get_info_for_msg(user_id), do: call(user_id, :get_info_for_msg)

  defp get_info_for_msg_impl(_reply, state) do
    {:reply, {state.avatar_url, state.display_name, state.username}, state}
  end

  def get_current_room_id(user_id) do
    get(user_id, :current_room_id)
  end

  def get(user_id, key), do: call(user_id, {:get, key})

  defp get_impl(key, _reply, state) do
    {:reply, Map.get(state, key), state}
  end

  def set_pid(user_id, pid), do: call(user_id, {:set_pid, pid})

  defp set_pid(pid, _reply, state) do
    if state.pid do
      Process.exit(state.pid, :kill)
    else
      Beef.Users.set_online(state.user_id)
    end

    Process.monitor(pid)

    {:reply, :ok, %{state | pid: pid}}
  end

  ##############################################################################
  ## MESSAGING API.
  ## TODO: change the first one to a call

  defp reconnect_to_voice_server_impl(voice_server_id, state) do
    if state.pid || state.current_room_id do
      with {:ok, ^voice_server_id} <-
             RegUtils.lookup_and_call(
               Onion.RoomSession,
               state.current_room_id,
               {:get_voice_server_id}
             ) do
        room = Rooms.get_room_by_id(state.current_room_id)
        Kousa.Room.join_vc_room(state.user_id, room)
      end
    end

    {:noreply, state}
  end

  defp handle_disconnect(pid, state = %{pid: pid}) do
    Beef.Users.set_offline(state.user_id)

    if state.current_room_id do
      Kousa.Room.leave_room(state.user_id, state.current_room_id)
    end

    {:stop, :normal, state}
  end

  defp handle_disconnect(_, state), do: {:noreply, state}

  #############################################################################
  ## ROUTER

  def handle_cast({:set, key, value}, state), do: set_impl(key, value, state)

  def handle_cast({:send_ws_msg, platform, msg}, state),
    do: send_ws_msg_impl(platform, msg, state)

  def handle_cast({:set_mute, value}, state), do: set_mute_impl(value, state)
  def handle_cast({:new_tokens, tokens}, state), do: new_tokens_impl(tokens, state)
  def handle_cast({:set_state, info}, state), do: set_state_impl(info, state)

  def handle_call(:get_info_for_msg, reply, state), do: get_info_for_msg_impl(reply, state)
  def handle_call({:get, key}, reply, state), do: get_impl(key, reply, state)
  def handle_call({:set_pid, pid}, reply, state), do: set_pid(pid, reply, state)

  def handle_info({:reconnect_to_voice_server, voice_server_id}, state),
    do: reconnect_to_voice_server_impl(voice_server_id, state)

  def handle_info({:DOWN, _ref, :process, pid, _reason}, state), do: handle_disconnect(pid, state)
end

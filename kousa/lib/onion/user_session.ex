defmodule Onion.UserSession do
  use GenServer
  alias Kousa.Utils.RegUtils

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

  def start_link(%State{
        user_id: user_id,
        username: username,
        display_name: display_name,
        avatar_url: avatar_url,
        current_room_id: current_room_id,
        muted: muted
      }) do
    GenServer.start_link(
      __MODULE__,
      %State{
        username: username,
        display_name: display_name,
        avatar_url: avatar_url,
        pid: nil,
        user_id: user_id,
        current_room_id: current_room_id,
        muted: muted == true
      },
      name: :"#{user_id}:user_session"
    )
  end

  def init(x) do
    {:ok, x}
  end

  @spec send_cast(String.t(), any) :: :ok
  def send_cast(user_id, params) do
    case GenRegistry.lookup(Onion.UserSession, user_id) do
      {:ok, session} ->
        GenServer.cast(session, params)

      err ->
        err
    end
  end

  def send_call!(user_id, params) do
    case send_call(user_id, params) do
      {:ok, x} ->
        x

      _ ->
        nil
    end
  end

  def send_call(user_id, params) do
    case GenRegistry.lookup(Onion.UserSession, user_id) do
      {:ok, session} ->
        {:ok, GenServer.call(session, params)}

      err ->
        {:error, err}
    end
  end

  def handle_cast({:set, key, value}, state) do
    {:noreply, Map.put(state, key, value)}
  end

  def handle_cast({:send_ws_msg, _platform, msg}, state) do
    if not is_nil(state.pid) do
      send(state.pid, {:remote_send, msg})
    end

    {:noreply, state}
  end

  def handle_cast({:set_mute, value}, state) do
    if not is_nil(state.current_room_id) do
      Kousa.Utils.RegUtils.lookup_and_cast(
        Onion.RoomSession,
        state.current_room_id,
        {:mute, state.user_id, value == true}
      )
    end

    {:noreply, %{state | muted: value == true}}
  end

  def handle_cast({:new_tokens, tokens}, state) do
    if not is_nil(state.pid) do
      send(state.pid, {:remote_send, %{op: "new-tokens", d: tokens}})
    end

    {:noreply, state}
  end

  def handle_cast({:set_state, info}, state) do
    {:noreply, Map.merge(state, info)}
  end

  def handle_cast({:set_current_room_id, current_room_id}, state) do
    {:noreply, %{state | current_room_id: current_room_id}}
  end

  def handle_call({:get_info_for_msg}, _, %State{} = state) do
    {:reply, {state.avatar_url, state.display_name, state.username}, state}
  end

  def handle_call({:get_current_room_id}, _, state) do
    {:reply, state.current_room_id, state}
  end

  def handle_call({:get, key}, _, state) do
    {:reply, Map.get(state, key), state}
  end

  def handle_call({:set_pid, pid}, _, state) do
    if not is_nil(state.pid) do
      send(state.pid, {:kill})
    else
      Beef.Users.set_online(state.user_id)
    end

    Process.monitor(pid)
    {:reply, :ok, %{state | pid: pid}}
  end

  def handle_info({:reconnect_to_voice_server, voice_server_id}, %State{} = state) do
    if not is_nil(state.pid) and not is_nil(state.current_room_id) do
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

  def handle_info({:DOWN, _ref, :process, pid, _reason}, state) do
    if state.pid === pid do
      Beef.Users.set_offline(state.user_id)

      if state.current_room_id do
        Kousa.Room.leave_room(state.user_id, state.current_room_id)
      end

      {:stop, :normal, state}
    else
      {:noreply, state}
    end
  end
end

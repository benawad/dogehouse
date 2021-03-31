defmodule Onion.RoomChat do
  use GenServer, restart: :temporary

  require Logger

  defmodule State do
    @type t :: %__MODULE__{
            room_id: String.t(),
            users: [String.t()],
            ban_map: map(),
            last_message_map: map()
          }

    defstruct room_id: "", users: [], ban_map: %{}, last_message_map: %{}
  end

  #################################################################################
  # REGISTRY AND SUPERVISION BOILERPLATE

  defp via(user_id), do: {:via, Registry, {Onion.RoomChatRegistry, user_id}}

  defp cast(user_id, params), do: GenServer.cast(via(user_id), params)
  defp call(user_id, params), do: GenServer.call(via(user_id), params)

  def start_link_supervised(room_id) do
    callers = [self() | Process.get(:"$callers", [])]

    case DynamicSupervisor.start_child(
           Onion.RoomChatDynamicSupervisor,
           {__MODULE__, room_id: room_id, callers: callers}
         ) do
      {:ok, pid} ->
        # ensures that the chat dies alongside the room
        Process.link(pid)
        {:ok, pid}
      {:error, {:already_started, pid}} ->
        Logger.warn("unexpectedly tried to restart already started Room chat #{room_id}")
        Process.link(pid)
        {:ignored, pid}
      error -> error
    end
  end

  def child_spec(init), do: %{super(init) | id: Keyword.get(init, :room_id)}

  def count, do: Registry.count(Onion.RoomChatRegistry)

  ###############################################################################
  ## INITIALIZATION BOILERPLATE

  def start_link(init) do
    GenServer.start_link(__MODULE__, init, name: via(init[:room_id]))
  end

  def init(init) do
    # adopt callers from the call point.
    Process.put(:"$callers", init[:callers])
    {:ok, struct(State, init)}
  end

  def kill(room_id) do
    Onion.RoomChatRegistry
    |> Registry.lookup(room_id)
    |> Enum.each(fn {room_pid, _} ->
      Process.exit(room_pid, :kill)
    end)
  end

  def ws_fan(users, msg) do
    Enum.each(users, fn uid ->
      Onion.UserSession.send_ws(uid, nil, msg)
    end)
  end

  ######################################################################
  ## API

  def banned?(room_id, who), do: call(room_id, {:banned?, who})

  defp banned_impl(who, _reply, state) do
    {:reply, who in Map.keys(state.ban_map), state}
  end

  def remove_user(room_id, user_id), do: cast(room_id, {:remove_user, user_id})

  defp remove_user_impl(user_id, state) do
    {:noreply, %{state | users: Enum.reject(state.users, &(&1 == user_id))}}
  end

  def add_user(room_id, user_id), do: cast(room_id, {:add_user, user_id})

  defp add_user_impl(user_id, state) do
    if user_id in state.users do
      {:noreply, state}
    else
      {:noreply, %{state | users: [user_id | state.users]}}
    end
  end

  def new_msg(room_id, user_id, msg, whispered_to) do
    cast(room_id, {:new_msg, user_id, msg, whispered_to})
  end

  defp new_msg_impl(user_id, msg, whispered_to, state) do
    last_timestamp = Map.get(state.last_message_map, user_id)

    # TODO: check to make sure this will be consistent when we move to a distributed
    # erlang cluster.
    {_, seconds, _} = :os.timestamp()

    if not Map.has_key?(state.ban_map, user_id) and
         (is_nil(last_timestamp) or seconds - last_timestamp > 0) do
      whispered_to_users_list = [user_id | whispered_to]

      users =
        if whispered_to != [],
          do: Enum.filter(state.users, fn uid -> Enum.member?(whispered_to_users_list, uid) end),
          else: state.users

      ws_fan(users, %{
        op: "new_chat_msg",
        d: %{
          userId: user_id,
          msg: msg
        }
      })

      {:noreply,
       %State{state | last_message_map: Map.put(state.last_message_map, user_id, seconds)}}
    else
      {:noreply, state}
    end
  end

  def message_deleted(room_id, user_id, message_id) do
    cast(room_id, {:message_deleted, user_id, message_id})
  end

  defp message_deleted_impl(user_id, message_id, state) do
    ws_fan(state.users, %{
      op: "message_deleted",
      d: %{
        messageId: message_id,
        deleterId: user_id
      }
    })

    {:noreply, state}
  end

  def ban_user(room_id, user_id), do: cast(room_id, {:ban_user, user_id})

  defp ban_user_impl(user_id, state) do
    ws_fan(state.users, %{
      op: "chat_user_banned",
      d: %{
        userId: user_id
      }
    })

    {:noreply, %State{state | ban_map: Map.put(state.ban_map, user_id, 1)}}
  end

  ################################################################################ 3
  ## ROUTER

  def handle_call({:banned?, who}, reply, state), do: banned_impl(who, reply, state)

  def handle_cast({:remove_user, user_id}, state), do: remove_user_impl(user_id, state)

  def handle_cast({:add_user, user_id}, state), do: add_user_impl(user_id, state)

  def handle_cast({:new_msg, user_id, msg, whispered_to}, state) do
    new_msg_impl(user_id, msg, whispered_to, state)
  end

  def handle_cast({:message_deleted, user_id, message_id}, state) do
    message_deleted_impl(user_id, message_id, state)
  end

  def handle_cast({:ban_user, user_id}, state), do: ban_user_impl(user_id, state)
end

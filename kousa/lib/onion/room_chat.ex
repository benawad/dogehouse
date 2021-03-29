defmodule Onion.RoomChat do
  use GenServer

  defmodule State do
    @type t :: %__MODULE__{
            room_id: String.t(),
            users: [String.t()],
            ban_map: map(),
            last_message_map: map()
          }

    defstruct room_id: "", users: [], ban_map: %{}, last_message_map: %{}
  end

  def start_link(state) do
    GenServer.start_link(
      __MODULE__,
      state,
      name: :"#{state.room_id}:room_chat"
    )
  end

  def init(x) do
    {:ok, x}
  end

  @spec start(String.t(), State.t()) :: :ok
  def start(room_id, state) do
    {:ok, session} =
      GenRegistry.lookup_or_start(__MODULE__, room_id, [
        state
      ])

    GenServer.cast(session, {:new, state})
  end

  def kill(room_id) do
    case GenRegistry.lookup(__MODULE__, room_id) do
      {:ok, session} ->
        Process.exit(session, :kill)
    end
  end

  def ws_fan(users, msg) do
    Enum.each(users, fn uid ->
      Onion.UserSession.send_ws_msg(uid, nil, msg)
    end)
  end

  # temporary, to get test introspection.  Will likely get refactored soon.
  def banned?(room, who) do
    GenServer.call(:"#{room}:room_chat", {:banned?, who})
  end

  defp banned_impl(who, _reply, state) do
    {:reply, who in Map.keys(state.ban_map), state}
  end

  def handle_call({:banned?, who}, reply, state), do: banned_impl(who, reply, state)

  def handle_cast({:remove_user, user_id}, %State{} = state) do
    {:noreply, %State{state | users: Enum.filter(state.users, &(&1 != user_id))}}
  end

  def handle_cast({:add_user, user_id}, %State{} = state) do
    {:noreply, %State{state | users: [user_id | Enum.filter(state.users, &(&1 != user_id))]}}
  end

  def handle_cast({:new, state}, _state) do
    {:noreply, state}
  end

  def handle_cast({:new_msg, user_id, msg, whispered_to}, %State{} = state) do
    last_timestamp = Map.get(state.last_message_map, user_id)
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

  def handle_cast({:message_deleted, user_id, message_id}, %State{} = state) do
    ws_fan(state.users, %{
      op: "message_deleted",
      d: %{
        messageId: message_id,
        deleterId: user_id
      }
    })

    {:noreply, state}
  end

  def handle_cast({:ban_user, user_id}, state) do
    ws_fan(state.users, %{
      op: "chat_user_banned",
      d: %{
        userId: user_id
      }
    })

    {:noreply, %State{state | ban_map: Map.put(state.ban_map, user_id, 1)}}
  end
end

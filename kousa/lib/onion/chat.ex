defmodule Onion.Chat do
  use GenServer, restart: :temporary

  alias Onion.PubSub
  alias Broth.Message.Chat.Delete
  alias Broth.Message.Chat.Send
  alias Kousa.Utils.UUID

  require Logger

  defstruct room_id: "", users: [], ban_map: %{}, last_message_map: %{}

  @type state :: %__MODULE__{
          room_id: String.t(),
          users: [String.t()],
          ban_map: map(),
          last_message_map: %{optional(UUID.t()) => DateTime.t()}
        }

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

      error ->
        error
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
    {:ok, struct(__MODULE__, init)}
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
    {:reply, user_banned?(who, state), state}
  end

  defp user_banned?(who, state) do
    who in Map.keys(state.ban_map)
  end

  def unban_user(room_id, user_id), do: cast(room_id, {:unban_user, user_id})

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

  def ban_user(room_id, user_id), do: cast(room_id, {:ban_user, user_id})

  defp ban_user_impl(user_id, state) do
    ws_fan(state.users, %{
      op: "chat_user_banned",
      d: %{
        userId: user_id
      }
    })

    {:noreply, %{state | ban_map: Map.put(state.ban_map, user_id, 1)}}
  end

  defp unban_user_impl(user_id, state) do
    ws_fan(state.users, %{
      op: "chat_user_unbanned",
      d: %{
        userId: user_id
      }
    })

    {:noreply, %{state | ban_map: Map.delete(state.ban_map, user_id)}}
  end

  #####################################################################
  ## send message

  @spec send_msg(UUID.t(), Send.t()) :: :ok
  def send_msg(room_id, payload) do
    cast(room_id, {:send_msg, payload})
  end

  @spec send_msg_impl(Send.t(), state) :: {:noreply, state}
  defp send_msg_impl(payload = %{from: from}, state) do
    # throttle sender
    with false <- should_throttle?(from, state),
         false <- user_banned?(from, state) do
      dispatch_message(payload, state)
      updated_message_map = Map.put(state.last_message_map, from, DateTime.utc_now())
      new_state = %{state | last_message_map: updated_message_map}
      {:noreply, new_state}
    else
      _ -> {:noreply, state}
    end
  end

  @message_time_limit_milliseconds 1000
  @spec should_throttle?(UUID.t(), state) :: boolean
  defp should_throttle?(user, %{last_message_times: m})
       when is_map_key(m, user) do
    DateTime.diff(m[user], DateTime.utc_now(), :millisecond) >= @message_time_limit_milliseconds
  end

  defp should_throttle?(_, _), do: false

  defp dispatch_message(payload, state) do
    case payload.whisperedTo do
      [] ->
        PubSub.broadcast("chat:" <> state.room_id, %Broth.Message{
          operator: "chat:send",
          payload: payload
        })

        :ok

      list ->
        # I am doing user blocking at socket_handler level
        list
        |> List.insert_at(0, payload.from)
        |> Enum.each(fn recipient_id ->
          PubSub.broadcast("chat:" <> recipient_id, %Broth.Message{
            operator: "chat:send",
            payload: payload
          })
        end)
    end
  end

  #############################################################################
  ## delete message

  # it seems like this doesn't need to be here, but, we are sending this
  # through the chat room for two reasons.
  # - because the chat room genserver is single-threaded it will make sure that
  #   the messages are well-ordered for everyone.
  # - eventually when the chat message logs are taken, we'll be able to
  #   add soft-deletion of messages into the message logs.
  @spec delete_message(UUID.t(), Delete.t()) :: :ok
  def delete_message(room_id, deletion = %Delete{}) do
    cast(room_id, {:delete_message, deletion})
  end

  defp delete_message_impl(deletion, state) do
    PubSub.broadcast("chat:" <> state.room_id, %Broth.Message{
      operator: "chat:delete",
      payload: deletion
    })

    {:noreply, state}
  end

  #############################################################################
  ## ROUTER

  def handle_call({:banned?, who}, reply, state), do: banned_impl(who, reply, state)

  def handle_cast({:unban_user, user_id}, state), do: unban_user_impl(user_id, state)

  def handle_cast({:remove_user, user_id}, state), do: remove_user_impl(user_id, state)

  def handle_cast({:add_user, user_id}, state), do: add_user_impl(user_id, state)

  def handle_cast({:send_msg, message}, state), do: send_msg_impl(message, state)

  def handle_cast({:delete_message, payload}, state), do: delete_message_impl(payload, state)

  def handle_cast({:ban_user, user_id}, state), do: ban_user_impl(user_id, state)
end

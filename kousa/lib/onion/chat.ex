defmodule Onion.Chat do
  use GenServer, restart: :temporary

  alias Onion.PubSub
  alias Broth.Message.Chat.Delete
  alias Broth.Message.Chat.Send
  alias Kousa.Utils.UUID

  require Logger

  defstruct room_id: "",
            room_creator_id: "",
            users: [],
            ban_map: %{},
            last_message_map: %{},
            follow_at_map: %{},
            chat_mode: :default,
            chat_throttle: 1000

  @type state :: %__MODULE__{
          room_id: String.t(),
          room_creator_id: String.t(),
          users: [String.t()],
          ban_map: map(),
          last_message_map: %{optional(UUID.t()) => DateTime.t()},
          follow_at_map: %{optional(UUID.t()) => DateTime.t() | nil},
          chat_mode: Beef.Schemas.Room.chatMode(),
          chat_throttle: integer()
        }

  #################################################################################
  # REGISTRY AND SUPERVISION BOILERPLATE

  defp via(user_id), do: {:via, Registry, {Onion.RoomChatRegistry, user_id}}

  defp cast(user_id, params), do: GenServer.cast(via(user_id), params)
  defp call(user_id, params), do: GenServer.call(via(user_id), params)

  def start_link_supervised(initial_values) do
    callers = [self() | Process.get(:"$callers", [])]

    case DynamicSupervisor.start_child(
           Onion.RoomChatDynamicSupervisor,
           {__MODULE__, Keyword.merge(initial_values, callers: callers)}
         ) do
      {:ok, pid} ->
        # ensures that the chat dies alongside the room
        Process.link(pid)
        {:ok, pid}

      {:error, {:already_started, pid}} ->
        Logger.warn(
          "unexpectedly tried to restart already started Room chat #{initial_values[:room_id]}"
        )

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

  def set_room_creator_id(room_id, id) do
    cast(room_id, {:set_room_creator_id, id})
  end

  defp set_room_creator_id_impl(id, %__MODULE__{} = state) do
    {:noreply, %{state | room_creator_id: id, follow_at_map: %{}}}
  end

  def set_chat_throttle(room_id, value) do
    cast(room_id, {:set_chat_throttle, value})
  end

  defp set_chat_throttle_impl(value, %__MODULE__{} = state) do
    {:noreply, %{state | chat_throttle: value}}
  end

  def banned?(room_id, who), do: call(room_id, {:banned?, who})

  defp banned_impl(who, _reply, state) do
    {:reply, user_banned?(who, state), state}
  end

  defp user_banned?(who, state) do
    who in Map.keys(state.ban_map)
  end

  alias Beef.Follows
  alias Beef.Schemas.Follow

  # users that meet the following criteria,
  # can chat in follower_only mode:
  # 0. creator of room
  # 1. mod
  # 2. speaker
  # 3. following room owner prior to joining room

  defp eligible_to_chat?(
         from,
         %__MODULE__{
           chat_mode: :follower_only,
           room_creator_id: room_creator_id
         } = state
       )
       when from == room_creator_id,
       do: {state, true}

  alias Beef.Rooms

  defp eligible_to_chat?(
         from,
         %__MODULE__{
           chat_mode: :follower_only,
           room_creator_id: room_creator_id,
           follow_at_map: follow_at_map
         } = state
       ) do
    {new_state, inserted_at_or_true} =
      if Map.has_key?(follow_at_map, from) do
        # cache hit
        {state, Map.get(follow_at_map, from)}
      else
        {status, _} = Rooms.get_room_status(from)

        # cache miss
        inserted_at_or_true =
          if status in [:mod, :speaker] do
            true
          else
            case Follows.get_follow(room_creator_id, from) do
              nil ->
                nil

              %Follow{inserted_at: inserted_at} ->
                inserted_at
            end
          end

        {%__MODULE__{state | follow_at_map: Map.put(follow_at_map, from, inserted_at_or_true)},
         inserted_at_or_true}
      end

    {new_state, not is_nil(inserted_at_or_true)}
  end

  defp eligible_to_chat?(_, state), do: {state, true}

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

  def set_can_chat(room_id, user_id), do: cast(room_id, {:set_can_chat, user_id})

  defp set_can_chat_impl(user_id, %__MODULE__{follow_at_map: follow_at_map} = state) do
    {:noreply, %{state | follow_at_map: Map.put(follow_at_map, user_id, true)}}
  end

  def set(room_id, key, value), do: cast(room_id, {:set, key, value})

  defp set_impl(key, value, state) do
    {:noreply, Map.put(state, key, value)}
  end

  def get(room_id, key), do: call(room_id, {:get, key})

  defp get_impl(key, _reply, state) do
    {:reply, Map.get(state, key), state}
  end

  #####################################################################
  ## send message

  @spec send_msg(UUID.t(), Send.t()) :: :ok
  def send_msg(room_id, payload) do
    cast(room_id, {:send_msg, payload})
  end

  defp send_msg_impl(_, %__MODULE__{chat_mode: :disabled} = state) do
    {:noreply, state}
  end

  @spec send_msg_impl(Send.t(), state) :: {:noreply, state}
  defp send_msg_impl(payload = %{from: from}, %__MODULE__{} = state) do
    # throttle sender
    with false <- should_throttle?(from, state),
         false <- user_banned?(from, state) do
      {new_state, can_chat} = eligible_to_chat?(from, state)

      if can_chat do
        dispatch_message(payload, new_state)

        {:noreply,
         %{
           new_state
           | last_message_map: Map.put(new_state.last_message_map, from, DateTime.utc_now())
         }}
      else
        {:noreply, new_state}
      end
    else
      _ -> {:noreply, state}
    end
  end

  @spec should_throttle?(UUID.t(), state) :: boolean
  defp should_throttle?(user_id, %__MODULE__{last_message_map: m, chat_throttle: ct})
       when is_map_key(m, user_id) do
    DateTime.diff(DateTime.utc_now(), m[user_id], :millisecond) <
      ct
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
        |> Enum.uniq
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

  def handle_call({:get, key}, reply, state), do: get_impl(key, reply, state)

  def handle_cast({:set_can_chat, user_id}, state) do
    set_can_chat_impl(user_id, state)
  end

  def handle_cast({:set_room_creator_id, id}, state) do
    set_room_creator_id_impl(id, state)
  end

  def handle_cast({:set_chat_throttle, value}, state) do
    set_chat_throttle_impl(value, state)
  end

  def handle_cast({:set, key, value}, state), do: set_impl(key, value, state)

  def handle_cast({:unban_user, user_id}, state), do: unban_user_impl(user_id, state)

  def handle_cast({:remove_user, user_id}, state), do: remove_user_impl(user_id, state)

  def handle_cast({:add_user, user_id}, state), do: add_user_impl(user_id, state)

  def handle_cast({:send_msg, message}, state), do: send_msg_impl(message, state)

  def handle_cast({:delete_message, payload}, state), do: delete_message_impl(payload, state)

  def handle_cast({:ban_user, user_id}, state), do: ban_user_impl(user_id, state)
end

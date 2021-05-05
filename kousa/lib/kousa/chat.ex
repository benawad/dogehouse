defmodule Kousa.Chat do
  alias Beef.Rooms
  alias Broth.Message.Chat.Delete
  alias Kousa.Utils.UUID
  alias Onion.Chat

  @timestamps_opts [type: :utc_datetime_usec]

  def send_msg(payload) do
    # TODO: pull room information from passed parameters from ws_session.
    case Beef.Users.get_by_id_with_current_room(payload.from) do
      nil ->
        :noop

      user ->
        current_time = DateTime.utc_now()

        if not is_nil(user.currentRoom) do
          if is_nil(user.lastChatMsg) do
            Beef.Users.set_last_chat_msg(user.id, current_time)
            Onion.Chat.send_msg(user.currentRoom.id, payload)
          else
            time_diff = DateTime.diff(current_time, user.lastChatMsg)

            if time_diff >= user.currentRoom.chatCooldown do
              Onion.Chat.send_msg(user.currentRoom.id, payload)
              Beef.Users.set_last_chat_msg(user.id, current_time)
            else
              {:error, "cooldown"}
            end
          end
        else
          {:error, "not in a room"}
        end
    end

    # {:error, "room is full"}
    :ok
  end

  @ban_roles [:creator, :mod]

  def ban_user(user_id, user_id_to_ban) do
    room =
      case Rooms.get_room_status(user_id) do
        {role, room = %{creatorId: creator_id}}
        when role in @ban_roles and creator_id != user_id_to_ban ->
          room

        _ ->
          nil
      end

    if room do
      Chat.ban_user(room.id, user_id_to_ban)
      :ok
    else
      {:error, "#{user_id} not authorized to ban #{user_id_to_ban}"}
    end
  end

  def unban_user(user_id, user_id_to_unban) do
    case Rooms.get_room_status(user_id) do
      {role, room} when role in @ban_roles ->
        Chat.unban_user(room.id, user_id_to_unban)

      _ ->
        nil
    end
  end

  @type delete_opts :: [by: UUID.t()]
  @spec delete_msg(Delete.t(), delete_opts) :: :ok
  # Delete room chat messages
  def delete_msg(deletion, opts) do
    user_id = opts[:by]

    room =
      case Rooms.get_room_status(user_id) do
        {:creator, room} ->
          room

        # Mods cannot delete creator's messages
        {:mod, room = %{creatorId: creator_id}}
        when user_id != creator_id ->
          room

        {:listener, room} when user_id == deletion.userId ->
          room

        _ ->
          nil
      end

    if room do
      Onion.Chat.delete_message(room.id, deletion)
    else
      {:error, "#{user_id} not authorized to delete the selected message"}
    end
  end
end

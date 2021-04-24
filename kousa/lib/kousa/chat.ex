defmodule Kousa.Chat do
  alias Beef.Rooms
  alias Onion.Chat
  alias Onion.PubSub
  alias Broth.Message

  def send_msg(user_id, payload) do
    with room_id when not is_nil(room_id) <- Beef.Users.get_current_room_id(user_id),
         {avatar_url, display_name, username} <- Onion.UserSession.get_info_for_msg(user_id) do

      # verify that the user isn't banned from chatting in the room.

      # if it's a whisper, verify that the user isn't blocked by the target user.

      PubSub.broadcast("chat:" <> room_id, %Message{
        operator: "chat:send",
        payload: payload
      })

      :ok
    end
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

  # Delete room chat messages
  def delete_message(deleter_id, message_id, user_id) do
    room =
      case Rooms.get_room_status(deleter_id) do
        {:creator, room} ->
          room

        # Mods can delete other mod' messages
        {:mod, room = %{creatorId: creator_id}}
        when user_id != creator_id ->
          room

        {:listener, room} when user_id == deleter_id ->
          room

        _ ->
          nil
      end

    if room do
      Onion.Chat.message_deleted(room.id, deleter_id, message_id)
      :ok
    else
      {:error, "#{user_id} not authorized to delete the selected message"}
    end
  end
end

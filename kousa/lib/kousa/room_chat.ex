defmodule Kousa.RoomChat do
  alias Beef.Rooms
  alias Onion.RoomChat

  def send_msg(_, [], _), do: :ok

  def send_msg(user_id, tokens, whisperedTo) do
    with room_id when not is_nil(room_id) <- Beef.Users.get_current_room_id(user_id),
         {avatar_url, display_name, username} <- Onion.UserSession.get_info_for_msg(user_id) do
      Onion.RoomChat.new_msg(
        room_id,
        user_id,
        %{
          id: Ecto.UUID.generate(),
          avatarUrl: avatar_url,
          displayName: display_name,
          username: username,
          userId: user_id,
          tokens: tokens,
          sentAt: DateTime.utc_now(),
          isWhisper: whisperedTo != []
        },
        whisperedTo
      )

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
      RoomChat.ban_user(room.id, user_id_to_ban)
      :ok
    else
      {:error, "#{user_id} not authorized to ban #{user_id_to_ban}"}
    end
  end

  def unban_user(user_id, user_id_to_unban) do
    case Rooms.get_room_status(user_id) do
      {role, room} when role in @ban_roles ->
        RoomChat.unban_user(room.id, user_id_to_unban)

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
      Onion.RoomChat.message_deleted(room.id, deleter_id, message_id)
      :ok
    else
      {:error, "#{user_id} not authorized to delete the selected message"}
    end
  end
end

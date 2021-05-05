defmodule Kousa.Chat do
  alias Beef.Rooms
  alias Broth.Message.Chat.Delete
  alias Kousa.Utils.UUID
  alias Onion.Chat

  def send_msg(payload) do
    # TODO: pull room information from passed parameters from ws_session.
    case Beef.Users.get_current_room_id(payload.from) do
      nil ->
        :noop

      room_id ->
        Onion.Chat.send_msg(room_id, payload)
    end

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

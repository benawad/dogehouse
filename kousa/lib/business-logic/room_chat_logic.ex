defmodule Kousa.BL.RoomChat do
  alias Kousa.{Data, RegUtils, Gen}

  @spec send_msg(String.t(), any) :: any
  def send_msg(user_id, [%{"t" => "text", "v" => v}] = tokens) when byte_size(v) <= 512 do
    # @todo validate token shape
    case Data.User.get_current_room_id(user_id) do
      nil ->
        nil

      current_room_id ->
        with {avatar_url, display_name} <-
               Gen.UserSession.send_call!(user_id, {:get_info_for_msg}) do
          RegUtils.lookup_and_cast(
            Gen.RoomChat,
            current_room_id,
            {:new_msg, user_id,
             %{
               id: Ecto.UUID.generate(),
               avatarUrl: avatar_url,
               displayName: display_name,
               userId: user_id,
               tokens: tokens
             }}
          )
        end
    end
  end

  def send_msg(_user_id, _tokens) do
  end

  def ban_user(user_id, user_id_to_ban) do
    case Data.Room.get_room_status(user_id) do
      {status, room}
      when status in [:creator, :mod] and not is_nil(room) and room.creatorId != user_id_to_ban ->
        RegUtils.lookup_and_cast(Gen.RoomChat, room.id, {:ban_user, user_id_to_ban})

      _ ->
        nil
    end

    :ok
  end
end

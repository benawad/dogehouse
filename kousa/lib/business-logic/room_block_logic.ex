defmodule Kousa.BL.RoomBlock do
  alias Beef.Users
  alias Beef.Rooms
  alias Kousa.Data.RoomBlock

  def unban(user_id, user_id_to_unban) do
    with {:ok, id} <- Users.tuple_get_current_room_id(user_id),
         true <- Rooms.owner?(id, user_id) do
      RoomBlock.unban(id, user_id_to_unban)
    end
  end

  @spec get_blocked_users(any, any) ::
          false | {:err | nil | list, nil | number | {:error, :not_found}}
  def get_blocked_users(user_id, offset) do
    with {:ok, id} <- Users.tuple_get_current_room_id(user_id),
         true <- Rooms.owner?(id, user_id) do
      RoomBlock.get_blocked_users(id, offset)
    end
  end
end

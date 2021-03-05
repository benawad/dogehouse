defmodule Kousa.BL.RoomBlock do
  alias Beef.Users

  def unban(user_id, user_id_to_unban) do
    with {:ok, id} <- Users.tuple_get_current_room_id(user_id),
         true <- Kousa.Data.Room.is_owner(id, user_id) do
      Kousa.Data.RoomBlock.unban(id, user_id_to_unban)
    end
  end

  @spec get_blocked_users(any, any) ::
          false | {:err | nil | list, nil | number | {:error, :not_found}}
  def get_blocked_users(user_id, offset) do
    with {:ok, id} <- Users.tuple_get_current_room_id(user_id),
         true <- Kousa.Data.Room.is_owner(id, user_id) do
      Kousa.Data.RoomBlock.get_blocked_users(id, offset)
    end
  end
end

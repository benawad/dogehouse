defmodule Kousa.RoomBlock do
  alias Beef.Users
  alias Beef.Rooms
  alias Beef.RoomBlocks

  def unban(user_id, user_id_to_unban) do
    with {:ok, id} when not is_nil(id) <- Users.tuple_get_current_room_id(user_id),
         true <- Rooms.owner?(id, user_id) do
      RoomBlocks.unban(id, user_id_to_unban)
    else
      _ -> nil
    end
  end

  @spec get_blocked_users(any, any) ::
          false | {:err | nil | list, nil | number | {:error, :not_found}}
  def get_blocked_users(user_id, offset) do
    with {:ok, id} when not is_nil(id) <- Users.tuple_get_current_room_id(user_id),
         true <- Rooms.owner?(id, user_id) do
      RoomBlocks.get_blocked_users(id, offset)
    else
      _ -> nil
    end
  end
end

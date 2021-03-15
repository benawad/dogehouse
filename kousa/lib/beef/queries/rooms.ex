defmodule Beef.Queries.Rooms do
  import Ecto.Query
  alias Beef.Schemas.User
  alias Beef.Schemas.Room

  def start do
    from(r in Room)
  end

  def userStart do
    from(u in User)
  end

  def filter_by_current_room_id(query, room_id) do
    where(query, [u], u.currentRoomId == ^room_id)
  end

  def filter_by_creator_id(query, creator_id) do
    where(query, [r], r.creatorId == ^creator_id)
  end

  def filter_by_room_id_and_creator_id(query, room_id, user_id) do
    where(query, [r], r.id == ^room_id and r.creatorId == ^user_id)
  end

  def limit_one(query) do
    limit(query, [r], 1)
  end
end

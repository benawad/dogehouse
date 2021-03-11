defmodule Beef.Queries.Rooms do
  import Ecto.Query
  alias Beef.Schemas.User
  alias Beef.Schemas.Room

  def start do
    from r in Room
  end

  def userStart do
    from u in User
  end

  def filter_by_current_room_id(query, room_id) do
    where(query, [r], r.currentRoomId == ^room_id)
  end

  def limit_one(query) do
    limit(query, [r], 1)
  end
end

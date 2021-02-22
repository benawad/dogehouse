defmodule Kousa.Data.RoomBlock do
  import Ecto.Query

  def is_blocked(room_id, user_id) do
    not is_nil(
      from(rb in Beef.RoomBlock,
        where: rb.userId == ^user_id and rb.roomId == ^room_id,
        limit: 1
      )
      |> Beef.Repo.one()
    )
  end

  def insert(data) do
    %Beef.RoomBlock{}
    |> Beef.RoomBlock.insert_changeset(data)
    |> Beef.Repo.insert(on_conflict: :nothing)
  end
end

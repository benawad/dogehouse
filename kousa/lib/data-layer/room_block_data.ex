defmodule Kousa.Data.RoomBlock do
  import Ecto.Query
  alias Kousa.Pagination
  alias Beef.Schemas.User
  alias Beef.RoomBlock
  alias Beef.Repo

  def unban(room_id, user_id) do
    from(rb in RoomBlock, where: rb.userId == ^user_id and rb.roomId == ^room_id)
    |> Repo.delete_all()
  end

  def blocked?(room_id, user_id) do
    not is_nil(
      from(rb in Beef.RoomBlock,
        where: rb.userId == ^user_id and rb.roomId == ^room_id,
        limit: 1
      )
      |> Beef.Repo.one()
    )
  end

  @fetch_limit 31

  @spec get_blocked_users(Ecto.UUID.t(), pos_integer) :: {User.t(), nil | number}
  def get_blocked_users(room_id, offset) do
    from(u in User,
      inner_join: rb in RoomBlock,
      on: u.id == rb.userId,
      where: rb.roomId == ^room_id,
      offset: ^offset,
      limit: @fetch_limit
    )
    |> Beef.Repo.all()
    |> Pagination.items_to_offset_tuple(offset, @fetch_limit)
  end

  def insert(data) do
    %Beef.RoomBlock{}
    |> Beef.RoomBlock.insert_changeset(data)
    |> Beef.Repo.insert(on_conflict: :nothing)
  end
end

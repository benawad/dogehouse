defmodule Kousa.Data.UserBlock do
  import Ecto.Query

  def is_blocked(user_id, user_id_blocked) do
    not is_nil(
      from(ub in Beef.UserBlock,
        where: ub.userId == ^user_id and ub.userIdBlocked == ^user_id_blocked,
        limit: 1
      )
      |> Beef.Repo.one()
    )
  end

  def insert(data) do
    %Beef.UserBlock{}
    |> Beef.UserBlock.insert_changeset(data)
    |> Beef.Repo.insert(on_conflict: :nothing)
  end
end

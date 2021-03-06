defmodule Beef.UserBlocks do
  @moduledoc """
  Empty context module for UserBlocks

  This module will probably go away when User/Block relationships
  are reconfigured to use Ecto associations
  """

  import Ecto.Query

  alias Beef.Schemas.UserBlock

  def blocked?(user_id, user_id_blocked) do
    not is_nil(
      from(ub in UserBlock,
        where: ub.userId == ^user_id and ub.userIdBlocked == ^user_id_blocked,
        limit: 1
      )
      |> Beef.Repo.one()
    )
  end

  def insert(data) do
    %UserBlock{}
    |> UserBlock.insert_changeset(data)
    |> Beef.Repo.insert(on_conflict: :nothing)
  end
end

defmodule Beef.Mutations.UserBlocks do
  @moduledoc """
    DB Mutation functions for UserBlocks
  """
  import Ecto.Query, warn: false

  alias Beef.Schemas.UserBlock
  alias Beef.Repo

  def insert(data) do
    %UserBlock{}
    |> UserBlock.insert_changeset(data)
    |> Repo.insert(on_conflict: :nothing)
  end

  def delete(user_id, user_id_to_block) do
    from(ub in UserBlock, where: ub.userId == ^user_id and ub.userIdBlocked == ^user_id_to_block)
    |> Beef.Repo.delete_all()
  end
end

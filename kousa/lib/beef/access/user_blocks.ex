defmodule Beef.Access.UserBlocks do
  @moduledoc """
    DB Access Functions for UserBlocks Table
  """

  import Ecto.Query

  alias Beef.Schemas.UserBlock
  alias Beef.Repo

  def blocked?(user_id, user_id_blocked) do
    not is_nil(
      from(ub in UserBlock,
        where: ub.userId == ^user_id and ub.userIdBlocked == ^user_id_blocked,
        limit: 1
      )
      |> Repo.one()
    )
  end
end

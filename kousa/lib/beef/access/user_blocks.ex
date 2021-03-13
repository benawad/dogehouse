defmodule Beef.Access.UserBlocks do
  @moduledoc """
    DB Access Functions for UserBlocks Table
  """

  # import Ecto.Query

  # alias Beef.Schemas.UserBlock
  alias Beef.Repo
  alias Beef.Queries.UserBlocks, as: Query

  def blocked?(user_id, user_id_blocked) do
    not is_nil(
      Query.start()
      |> Query.filter_by_id_and_blockedId(user_id, user_id_blocked)
      |> Repo.one()
    )
  end
end

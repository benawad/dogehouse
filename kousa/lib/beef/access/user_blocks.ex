defmodule Beef.Access.UserBlocks do
  @moduledoc """
    DB Access Functions for UserBlocks Table
  """

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

  @spec username_blocked?(any, any) :: boolean
  def username_blocked?(username, user_id_blocked) do
    not is_nil(
      Query.start()
      |> Query.filter_by_username_and_blockedId(username, user_id_blocked)
      |> Repo.one()
    )
  end
end

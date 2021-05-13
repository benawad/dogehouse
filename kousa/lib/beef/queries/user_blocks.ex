defmodule Beef.Queries.UserBlocks do
  @moduledoc """
  Query builder functions for UserBlocks
  """

  import Ecto.Query, warn: false
  alias Beef.Schemas.UserBlock
  alias Beef.Schemas.User

  def start do
    from(ub in UserBlock)
  end

  def filter_by_id_and_blockedId(query, user_id, user_id_blockedId) do
    where(query, [ub], ub.userId == ^user_id and ub.userIdBlocked == ^user_id_blockedId)
  end

  def filter_by_username_and_blockedId(query, username, user_id_blocked) do
    query
    |> join(:inner, [ub], u in User, on: u.id == ub.userId)
    |> where([ub, u], ub.userIdBlocked == ^user_id_blocked and u.username == ^username)
  end
end

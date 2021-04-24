defmodule Beef.Queries.UserBlocks do
  @moduledoc """
  Query builder functions for UserBlocks
  """

  import Ecto.Query, warn: false
  alias Beef.Schemas.UserBlock

  def start do
    from(ub in UserBlock)
  end

  def filter_by_id_and_blockedId(query, user_id, user_id_blockedId) do
    where(query, [ub], ub.userId == ^user_id and ub.userIdBlocked == ^user_id_blockedId)
  end
end

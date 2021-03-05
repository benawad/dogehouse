defmodule Beef.Queries.Users do
  @moduledoc """
  all functions in this module should be "Query builder" functions,
  they should not touch the database.
  """

  import Ecto.Query, warn: false
  alias Beef.Schemas.User

  def start do
    from u in User
  end

  def filter_by_github_ids(query, github_ids) do
    where(query, [u], u.github_id in ^[github_ids])
  end

  def select_id(query) do
    select(query, [u], u.id)
  end
end

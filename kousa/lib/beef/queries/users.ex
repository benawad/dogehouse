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
    where(query, [u], u.githubId in ^github_ids)
  end

  def select_id(query) do
    select(query, [u], u.id)
  end

  def filter_by_id(query, user_id) do
    where(query, [u], u.id == ^user_id)
  end

  def inc_num_following_by_n(query, n) do
    update(query, [
      inc: [
        numFollowing: ^n
      ]
    ])
  end

  def update_reason_for_ban(query, reason_for_ban) do
    update(query, [
      set: [
        reasonForBan: ^reason_for_ban
      ]
    ])
  end
end

defmodule Beef.Access.User do
  import Ecto.Query, warn: false

  alias Beef.Repo
  alias Beef.Schemas.User

  def find_by_github_ids(ids) do
    from(u in User, where: u.githubId in ^ids, select: u.id)
    |> Repo.all()
  end

  def get_by_id(user_id) do
    Repo.get(User, user_id)
  end

  def get_by_username(username) do
    from(u in User,
      where: u.username == ^username,
      limit: 1
    )
    |> Repo.one()
  end
end

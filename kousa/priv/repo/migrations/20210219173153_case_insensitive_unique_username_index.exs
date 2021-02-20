defmodule Beef.Repo.Migrations.CaseInsensitiveUniqueUsernameIndex do
  use Ecto.Migration

  def change do
    execute("drop index users_username_index;", "")
    execute("create unique index users_username_index on users(lower(username));", "")
  end
end

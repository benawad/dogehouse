defmodule Beef.Repo.Migrations.GithubIdNullable do
  use Ecto.Migration

  def change do
    alter table(:users) do
      modify :githubId, :text, null: true
    end
  end
end

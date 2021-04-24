defmodule Beef.Repo.Migrations.AccessToken do
  use Ecto.Migration

  def change do
    alter table(:users) do
      modify :email, :text, null: true
      add :githubAccessToken, :text
    end
  end
end

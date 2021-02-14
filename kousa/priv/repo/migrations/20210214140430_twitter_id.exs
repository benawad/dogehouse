defmodule Beef.Repo.Migrations.TwitterId do
  use Ecto.Migration

  def change do
    alter table(:users) do
      add :twitterId, :text
    end

    create unique_index(:users, [:email])
    create unique_index(:users, [:twitterId])
  end
end

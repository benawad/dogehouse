defmodule Beef.Repo.Migrations.HasLoggedIn do
  use Ecto.Migration

  def change do
    alter table(:users) do
      add :hasLoggedIn, :boolean, default: false
    end
  end
end

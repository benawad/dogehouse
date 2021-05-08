defmodule Beef.Repo.Migrations.Contributions do
  use Ecto.Migration

  def change do
    alter table(:users) do
      add :contributions, :integer, default: 0
    end
  end
end

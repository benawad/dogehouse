defmodule Beef.Repo.Migrations.AdminUpdate do
  use Ecto.Migration

  def change do
    alter table(:users) do
      add :staff, :boolean, default: false
      add :contributions, :integer, default: 0
    end
  end
end

defmodule Beef.Repo.Migrations.Staff do
  use Ecto.Migration

  def change do
    alter table(:users) do
      add :staff, :boolean, default: false
    end
  end
end

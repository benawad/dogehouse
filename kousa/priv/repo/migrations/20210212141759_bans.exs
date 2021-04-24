defmodule Beef.Repo.Migrations.Bans do
  use Ecto.Migration

  def change do
    alter table(:users) do
      add :reasonForBan, :text
    end
  end
end

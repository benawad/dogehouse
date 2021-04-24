defmodule Beef.Repo.Migrations.ScheduledRoomStarted do
  use Ecto.Migration

  def change do
    alter table(:scheduled_rooms) do
      add :started, :boolean, null: false, default: false
    end
  end
end

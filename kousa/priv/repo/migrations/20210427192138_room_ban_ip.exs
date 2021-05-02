defmodule Beef.Repo.Migrations.RoomBanIp do
  use Ecto.Migration

  def change do
    alter table(:room_blocks) do
      add :ip, :text
    end
  end
end

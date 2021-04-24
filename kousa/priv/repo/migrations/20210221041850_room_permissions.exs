defmodule Beef.Repo.Migrations.RoomPermissions do
  use Ecto.Migration

  def change do
    alter table(:users) do
      remove :modForRoomId
      remove :canSpeakForRoomId
    end

    create table(:room_permissions, primary_key: false) do
      add :userId, references(:users, on_delete: :delete_all, type: :uuid), null: false, primary_key: true
      add :roomId, references(:rooms, on_delete: :delete_all, type: :uuid), null: false, primary_key: true
      add :isSpeaker, :boolean, default: false
      add :isMod, :boolean, default: false
      add :askedToSpeak, :boolean, default: false

      timestamps()
    end
  end
end

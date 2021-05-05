defmodule Beef.Repo.Migrations.MostTables do
  use Ecto.Migration

  def change do
    execute("CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";", "")

    create table(:users, primary_key: false) do
      add :id, :uuid, primary_key: true, default: fragment("uuid_generate_v4()")
      add :githubId, :text, null: false
      add :username, :text, null: false
      add :bio, :text, default: ""
      add :avatarUrl, :text, null: false
      add :tokenVersion, :integer, default: 1
      add :numFollowing, :integer, default: 0
      add :numFollowers, :integer, default: 0
      add :online, :boolean, default: false
      add :lastOnline, :naive_datetime

      timestamps()
    end

    create unique_index(:users, [:githubId])
    create unique_index(:users, [:username])

    create table(:rooms, primary_key: false) do
      add :id, :uuid, primary_key: true, default: fragment("uuid_generate_v4()")
      add :name, :string, null: false
      add :numPeopleInside, :integer, default: 0

      add :creatorId, references(:users, on_delete: :delete_all, type: :uuid), null: false

      timestamps()
    end

    create unique_index(:rooms, [:creatorId])

    alter table(:users) do
      add :currentRoomId, references(:rooms, type: :uuid, on_delete: :nilify_all)
      add :modForRoomId, references(:rooms, type: :uuid, on_delete: :nilify_all)
      add :canSpeakForRoomId, references(:rooms, type: :uuid, on_delete: :nilify_all)
    end

    create table(:followers, primary_key: false) do
      add :userId, references(:users, on_delete: :delete_all, type: :uuid), null: false, primary_key: true
      add :followerId, references(:users, on_delete: :delete_all, type: :uuid), null: false, primary_key: true

      timestamps()
    end

    create table(:room_blocks, primary_key: false) do
      add :userId, references(:users, on_delete: :delete_all, type: :uuid), null: false, primary_key: true
      add :roomId, references(:rooms, on_delete: :delete_all, type: :uuid), null: false, primary_key: true
      add :modId, references(:users, on_delete: :delete_all, type: :uuid), null: false

      timestamps()
    end

    create table(:user_blocks, primary_key: false) do
      add :userId, references(:users, on_delete: :delete_all, type: :uuid), null: false, primary_key: true
      add :userIdBlocked, references(:users, on_delete: :delete_all, type: :uuid), null: false, primary_key: true

      timestamps()
    end
  end
end

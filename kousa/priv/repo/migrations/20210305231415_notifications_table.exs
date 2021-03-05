defmodule Beef.Repo.Migrations.NotificationsTable do
  use Ecto.Migration

  def change do
    create table(:notifications, primary_key: false) do
      add :id, :uuid, primary_key: true, default: fragment("uuid_generate_v4()")
      add :type, :string, null: false
      add :is_read, :boolean, default: false
      add :user_id, references(:users, on_delete: :delete_all, type: :uuid), null: false, primary_key: true
      add :notifier_id, references(:users, on_delete: :delete_all, type: :uuid), null: true, primary_key: true
      timestamps()
    end
  end
end

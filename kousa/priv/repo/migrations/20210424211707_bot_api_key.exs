defmodule Beef.Repo.Migrations.BotApiKey do
  use Ecto.Migration

  def change do
  create table(:bot_api_keys, primary_key: false) do
    add :ownerId, references(:users, on_delete: :delete_all, type: :uuid), null: false, primary_key: true
    add :botId, references(:users, on_delete: :delete_all, type: :uuid), null: false, primary_key: true
    add :apiKey, :uuid, null: false

    timestamps()
  end

  end
end

defmodule Beef.Repo.Migrations.UserBotApiKey do
  use Ecto.Migration

  def change do
    alter table(:users) do
      add :botOwnerId, references(:users, on_delete: :delete_all, type: :uuid)
      add :apiKey, :uuid
    end

  end
end

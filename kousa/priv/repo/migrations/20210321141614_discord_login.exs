defmodule Beef.Repo.Migrations.DiscordLogin do
  use Ecto.Migration

  def change do
    alter table(:users) do
      add :discordId, :string, null: true, default: nil
      add :discordAccessToken, :string, null: true, default: nil
    end
  end
end

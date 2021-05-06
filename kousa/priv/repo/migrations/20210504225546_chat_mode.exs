defmodule Beef.Repo.Migrations.ChatMode do
  use Ecto.Migration

  def change do
    alter table(:rooms) do
      add :autoSpeaker, :boolean, default: false
      add :chatMode, :string, default: "default"
    end
  end
end

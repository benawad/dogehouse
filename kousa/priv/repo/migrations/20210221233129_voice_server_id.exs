defmodule Beef.Repo.Migrations.VoiceServerId do
  use Ecto.Migration

  def change do
    alter table(:rooms) do
      add :voiceServerId, :string, default: ""
    end
  end
end

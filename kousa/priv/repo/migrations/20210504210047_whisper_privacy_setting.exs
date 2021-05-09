defmodule Beef.Repo.Migrations.WhisperPrivacySetting do
  use Ecto.Migration

  def change do
    alter table(:users) do
      add :whisperPrivacySetting, :text, default: "on"
    end
  end
end

defmodule Beef.Repo.Migrations.ExternalProfileLink do
  use Ecto.Migration

  def change do
    alter table(:users) do
      add :externalProfileLink, :text, default: nil, null: true
    end
  end
end

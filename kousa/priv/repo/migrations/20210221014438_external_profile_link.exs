defmodule Beef.Repo.Migrations.ExternalProfileLink do
  use Ecto.Migration

  def change do
    alter table(:users) do
      add :externalProfileLink, :text, default: nil, allow_nil: true
    end
  end
end

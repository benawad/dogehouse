defmodule Beef.Repo.Migrations.DefaultTimestamps do
  use Ecto.Migration

  def change do
    alter table(:users) do
      modify :inserted_at, :naive_datetime, null: false, default: fragment("now()")
      modify :updated_at, :naive_datetime, null: false, default: fragment("now()")
    end
    alter table(:followers) do
      modify :inserted_at, :naive_datetime, null: false, default: fragment("now()")
      modify :updated_at, :naive_datetime, null: false, default: fragment("now()")
    end
  end
end

defmodule Beef.Repo.Migrations.ChatThrottle do
  use Ecto.Migration

  def change do
    alter table(:rooms) do
      add :chatThrottle, :integer, default: 1000, min: 500
    end
  end
end

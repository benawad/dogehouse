defmodule Beef.Repo.Migrations.ChatThrottle do
  use Ecto.Migration

  def change do
    alter table(:rooms) do
      add :chatThrottle, :int, default: 1000
    end
  end
end

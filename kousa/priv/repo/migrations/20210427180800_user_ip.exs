defmodule Beef.Repo.Migrations.UserIp do
  use Ecto.Migration

  def change do
    alter table(:users) do
      add :ip, :text
    end
  end
end

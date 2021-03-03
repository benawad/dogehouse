defmodule Beef.Repo.Migrations.RoomDescription do
  use Ecto.Migration

  def change do
    alter table(:rooms) do
      add :description, :string, default: ""
    end
  end
end

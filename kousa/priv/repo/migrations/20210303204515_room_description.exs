defmodule Beef.Repo.Migrations.RoomDescription do
  use Ecto.Migration

  def change do
    alter table(:rooms) do
      add :description, :text, default: ""
    end
  end
end

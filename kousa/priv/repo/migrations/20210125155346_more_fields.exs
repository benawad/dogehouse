defmodule Beef.Repo.Migrations.MoreFields do
  use Ecto.Migration

  def change do
    alter table(:rooms) do
      add :isPrivate, :boolean, default: true
      add :chatCooldown, :integer, default: 1, min: 1
      add(:peoplePreviewList, {:array, :map}, default: [])
    end

    alter table(:users) do
      add :displayName, :string, default: ""
    end
  end
end

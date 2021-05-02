defmodule Beef.Repo.Migrations.EmailsAreNoLongerUnique do
  use Ecto.Migration

  def change do
    drop index(:users, [:email])
  end
end

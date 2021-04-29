defmodule Beef.Repo.Migrations.BannerUrl do
  use Ecto.Migration

  def change do
    alter table(:users) do
      add :bannerUrl, :text
    end
  end
end

defmodule Beef.Repo.Migrations.SetTimezoneForNow do
  use Ecto.Migration

  def change do
    {:ok, %{rows: [[ db_name ]]}} = Ecto.Adapters.SQL.query(Beef.Repo, "select current_database()")

    execute("ALTER DATABASE "<>db_name<>" SET timezone TO 'UTC';", "")
    execute("SET timezone TO 'UTC';", "")
  end
end

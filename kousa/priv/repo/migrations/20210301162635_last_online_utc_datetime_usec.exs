defmodule Beef.Repo.Migrations.LastOnlineUtcDatetimeUsec do
  use Ecto.Migration

  def change do
    execute(
      """
      ALTER TABLE users
      ALTER "lastOnline" TYPE timestamptz USING "lastOnline" AT TIME ZONE 'UTC'
      , ALTER "lastOnline" SET DEFAULT now();
      """,
      ""
    )
  end
end

defmodule Beef.Repo.Migrations.UseUtcDatetimeUsec do
  use Ecto.Migration

  def change do
    # https://dba.stackexchange.com/questions/134385/convert-postgres-timestamp-to-timestamptz
    Enum.each(["followers", "room_blocks", "room_permissions", "rooms", "user_blocks", "users"], fn table_name ->
      execute("""
              ALTER TABLE #{table_name}
              ALTER inserted_at TYPE timestamptz USING inserted_at AT TIME ZONE 'UTC'
              , ALTER inserted_at SET DEFAULT now();
              """, "")
      execute("""
              ALTER TABLE #{table_name}
              ALTER updated_at TYPE timestamptz USING updated_at AT TIME ZONE 'UTC'
              , ALTER updated_at SET DEFAULT now();
              """, "")
    end)
  end
end

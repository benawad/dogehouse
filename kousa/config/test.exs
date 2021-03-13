import Config

database_url = "postgres://postgres:postgres@localhost/kousa_repo2_test"

config :kousa, Beef.Repo,
  url: database_url,
  pool: Ecto.Adapters.SQL.Sandbox

config :logger, level: :error

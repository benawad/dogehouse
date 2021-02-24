import Config

database_url =
  System.get_env("DATABASE_URL") ||
    "postgres://postgres:postgres@localhost/kousa_repo2"

config :kousa, Beef.Repo, url: database_url

config :logger, level: :error

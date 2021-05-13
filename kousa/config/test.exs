import Config

database_url = System.get_env("DATABASE_URL") || "postgres://postgres:postgres@localhost/kousa_repo2_test"

config :kousa, Beef.Repo,
  url: database_url,
  pool: Ecto.Adapters.SQL.Sandbox

config :logger, level: :error

if System.get_env("GITHUB_ACTIONS") do
  config :app, App.Repo,
    username: "postgres",
    password: "postgres"
end

config :kousa,
  web_url: System.get_env("WEB_URL") || "http://localhost:3000",
  api_url: System.get_env("API_URL") || "http://localhost:4001",
  access_token_secret: "thisistheaccesstokenfortest",
  refresh_token_secret: "thisistherefreshtokenfortest",
  ben_github_id: "notreallybensgithubid"

config :kousa, websocket_auth_timeout: 50

use Mix.Config

config :kousa, ecto_repos: [Beef.Repo]
config :kousa, max_room_size: 1000
config :kousa, websocket_auth_timeout: 10_000
config :extwitter, :json_library, Poison

import_config "#{Mix.env()}.exs"

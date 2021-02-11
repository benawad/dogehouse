import Config

config :kousa, ecto_repos: [Beef.Repo]
config :kousa, max_room_size: 100

import_config "#{Mix.env()}.exs"

use Mix.Config

config :kousa, ecto_repos: [Beef.Repo]
config :kousa, max_room_size: 1000
config :extwitter, :json_library, Poison

import_config "#{Mix.env()}.exs"

# config :ueberauth, Ueberauth,
#   providers: [
#     github: {Ueberauth.Strategy.Github, [default_scope: "user,user:email"]}
#   ],
#   json_library: Poison

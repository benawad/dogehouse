use Mix.Config

config :logger, level: :info

database_url =
  System.get_env("DATABASE_URL") ||
    "postgres://postgres:postgres@localhost/kousa_repo2"

config :kousa, Beef.Repo, url: database_url

# TODO: remove system environment variables and make
# dev deployment easier

config :ueberauth, Ueberauth.Strategy.Github.OAuth,
  client_id:
    System.get_env("GITHUB_CLIENT_ID") ||
      raise("""
      environment variable GITHUB_CLIENT_ID is missing.
      Create an oauth application on GitHub to get one
      """),
  client_secret:
    System.get_env("GITHUB_CLIENT_SECRET") ||
      raise("""
      environment variable GITHUB_CLIENT_SECRET is missing.
      Create an oauth application on GitHub to get one
      """)

config :kousa,
  num_voice_servers: 1,
  web_url: System.get_env("WEB_URL") || "http://localhost:3000",
  api_url: System.get_env("API_URL") || "http://localhost:4001",
  secret_key_base:
    "213lo12j3kl21j3kl21alaksjdklasjdklajsldjsaldjlasdlaksjdklasjdklajsldjsaldjlasdlaksjdklasjdklajsldjsaldjlasdadjlasjddlkijoqwijdoqwjd12loki3jhl12jelk12jekl1221099dj120",
  env: :dev,
  ben_github_id:
    System.get_env("BEN_GITHUB_ID") ||
      raise("""
      environment variable BEN_GITHUB_ID is missing.
      """),
  access_token_secret:
    System.get_env("ACCESS_TOKEN_SECRET") ||
      raise("""
      environment variable ACCESS_TOKEN_SECRET is missing.
      type some random characters to create one
      """),
  refresh_token_secret:
    System.get_env("REFRESH_TOKEN_SECRET") ||
      raise("""
      environment variable REFRESH_TOKEN_SECRET is missing.
      type some random characters to create one
      """)

config :joken,
  access_token_secret: System.fetch_env!("ACCESS_TOKEN_SECRET"),
  refresh_token_secret: System.fetch_env!("REFRESH_TOKEN_SECRET")

config :ueberauth, Ueberauth.Strategy.Google.OAuth,
  client_id:
    System.get_env("GOOGLE_CLIENT_ID") ||
      raise("""
      environment variable GOOGLE_CLIENT_ID is missing.
      Create an oauth application on Google to get one
      """),
  client_secret:
    System.get_env("GOOGLE_CLIENT_SECRET") ||
      raise("""
        environment variable GOOGLE_CLIENT_SECRET is missing.
        Create an oauth application on Google to get one
      """)

config :ueberauth, Ueberauth.Strategy.Twitter.OAuth,
  consumer_key:
    System.get_env("TWITTER_API_KEY") ||
      raise("""
      environment variable TWITTER_API_KEY is missing.
      Create an oauth application on Twitter to get one
      """),
  consumer_secret:
    System.get_env("TWITTER_SECRET_KEY") ||
      raise("""
        environment variable TWITTER_SECRET_KEY is missing.
        Create an oauth application on Twitter to get one
      """)

config :ueberauth, Ueberauth.Strategy.Discord.OAuth,
  client_id:
    System.get_env("DISCORD_CLIENT_ID") ||
      raise("""
      environment variable DISCORD_CLIENT_ID is missing.
      Create an oauth application on Discord to get one
      """),
  client_secret:
    System.get_env("DISCORD_CLIENT_SECRET") ||
      raise("""
      environment variable DISCORD_CLIENT_SECRET is missing.
      Create an oauth application on Discord to get one
      """)

config :extwitter, :oauth,
  consumer_key:
    System.get_env("TWITTER_API_KEY") ||
      raise("""
      environment variable TWITTER_API_KEY is missing.
      Create an oauth application on Twitter to get one
      """),
  consumer_secret:
    System.get_env("TWITTER_SECRET_KEY") ||
      raise("""
      environment variable TWITTER_SECRET_KEY is missing.
      Create an oauth application on Twitter to get one
      """),
  access_token:
    System.get_env("TWITTER_BEARER_TOKEN") ||
      raise("""
      environment variable TWITTER_BEARER_TOKEN is missing.
      Create an oauth application on Twitter to get one
      """),
  access_token_secret: ""

import Config

database_url =
  System.get_env("DATABASE_URL") ||
    raise """
    environment variable DATABASE_URL is missing.
    For example: ecto://USER:PASS@HOST/DATABASE
    """

config :kousa, Beef.Repo, url: database_url

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

config :kousa,
  num_voice_servers: 1,
  staging?: System.get_env("IS_STAGING") == "true",
  secret_key_base:
    System.get_env("SECRET_KEY_BASE") ||
      raise("""
      environment variable SECRET_KEY_BASE is missing.
      """),
  ben_github_id:
    System.get_env("BEN_GITHUB_ID") ||
      raise("""
      environment variable BEN_GITHUB_ID is missing.
      """),
  rabbit_url:
    System.get_env("RABBITMQ_URL") ||
      raise("""
      environment variable RABBITMQ_URL is missing.
      """),
  web_url: System.get_env("WEB_URL") || "https://dogehouse.tv",
  api_url: System.get_env("API_URL") || "https://api.dogehouse.tv",
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

if(System.get_env("SENTRY_DNS") != nil) do
  IO.warn("The SENTRY_DNS environment variable is deprecated, use SENTRY_DSN instead")
end

config :sentry,
  dsn:
    System.get_env("SENTRY_DSN") || System.get_env("SENTRY_DNS") ||
      raise("""
      environment variable SENTRY_DSN is missing.
      """),
  environment_name: :prod,
  enable_source_code_context: true,
  root_source_code_path: File.cwd!(),
  tags: %{
    env: "production"
  },
  included_environments: [:prod]

config :joken,
  access_token_key: System.fetch_env!("ACCESS_TOKEN_SECRET"),
  refresh_token_key: System.fetch_env!("REFRESH_TOKEN_SECRET")

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

IO.puts("staging?:")
IO.puts(Application.get_env(:kousa, :staging?))

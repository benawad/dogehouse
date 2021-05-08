defmodule Kousa.MixProject do
  use Mix.Project

  def project do
    [
      app: :kousa,
      version: "0.2.1",
      elixir: "~> 1.11",
      start_permanent: Mix.env() == :prod,
      deps: deps(),
      test_coverage: [tool: ExCoveralls],
      preferred_cli_env: [
        coveralls: :test,
        "coveralls.html": :test
      ],
      elixirc_paths: elixirc_paths(Mix.env()),
      aliases: aliases()
    ]
  end

  def application do
    dev_only_apps = List.wrap(if Mix.env() == :dev, do: :remix)
    test_only_apps = List.wrap(if Mix.env() == :test, do: :websockex)

    [
      mod: {Kousa, []},
      # moved logger to 2nd position to kill this error
      # calling logger:remove_handler(default) failed: :error {:badmatch, {:error, {:not_found, :default}}}
      extra_applications:
        [:amqp, :logger, :ueberauth_github, :ueberauth_google, :prometheus_ex] ++
          dev_only_apps ++ test_only_apps
    ]
  end

  defp deps do
    [
      {:amqp, "~> 2.1"},
      {:plug_cowboy, "~> 2.5"},
      {:phoenix_pubsub, "~> 2.0.0"},
      {:ecto_sql, "~> 3.0"},
      {:ecto_enum, "~> 1.4"},
      {:jason, "~> 1.2"},
      {:joken, "~> 2.0"},
      {:elixir_uuid, "~> 1.2"},
      {:net_address, "~> 0.3"},
      # TODO: switch off of httpoison to, e.g. Mojito or Finch
      {:httpoison, "~> 1.8"},
      {:finch, "~> 0.6"},
      {:sentry, "~> 8.0"},
      {:postgrex, ">= 0.0.0"},
      {:remix, "~> 0.0.1", only: :dev},
      {:ueberauth, "~> 0.6"},
      {:ueberauth_github, "~> 0.7"},
      {:oauther, "~> 1.1"},
      {:extwitter, "~> 0.12"},
      {:ueberauth_twitter, "~> 0.3"},
      {:ueberauth_google, "~> 0.10"},
      {:prometheus_ex, "~> 3.0"},
      {:prometheus_plugs, "~> 1.1.1"},
      {:timex, "~> 3.6"},
      # style ENFORCEMENT
      {:credo, "~> 1.5.5"},
      # test helpers
      {:faker, "~> 0.16.0", only: :test},
      {:excoveralls, "~> 0.10", only: :test},
      {:ueberauth_discord, "~> 0.5.2"},
      {:websockex, "~> 0.4.3", only: :test}
    ]
  end

  defp elixirc_paths(:test), do: ["lib", "test/_support"]
  defp elixirc_paths(_), do: ["lib"]

  defp aliases do
    [
      "ecto.setup": ["ecto.create", "ecto.migrate"],
      "ecto.reset": ["ecto.drop", "ecto.setup"],
      test: ["ecto.create --quiet", "ecto.migrate", "test"]
    ]
  end
end

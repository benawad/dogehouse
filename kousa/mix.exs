defmodule Kousa.MixProject do
  use Mix.Project

  def project do
    [
      app: :kousa,
      version: "0.1.0",
      elixir: "~> 1.9",
      start_permanent: Mix.env() == :prod,
      deps: deps()
    ]
  end

  # Run "mix help compile.app" to learn about applications.
  def application do
    dev_only_apps = if Mix.env() == :dev, do: [:remix], else: []

    [
      mod: {Kousa, []},
      extra_applications: [:logger, :amqp] ++ dev_only_apps
    ]
  end

  # Run "mix help deps" to learn about dependencies.
  defp deps do
    [
      {:amqp, "~> 1.0"},
      {:gen_registry, "~> 1.0"},
      {:plug_cowboy, "~> 2.0"},
      {:poison, "~> 3.1"},
      {:ecto_sql, "~> 3.0"},
      {:jason, "~> 1.2"},
      {:joken, "~> 2.0"},
      {:httpoison, "~> 1.8"},
      {:decorator, "~> 1.2"},
      {:sentry, "~> 8.0"},
      {:postgrex, ">= 0.0.0"},
      {:remix, "~> 0.0.1", only: :dev},
      {:oauther, "~> 1.1"},
      {:extwitter, "~> 0.12"}
      # {:dep_from_hexpm, "~> 0.3.0"},
      # {:dep_from_git, git: "https://github.com/elixir-lang/my_dep.git", tag: "0.1.0"}
    ]
  end
end

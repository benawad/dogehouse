defmodule Banana.MixProject do
  use Mix.Project

  def project do
    [
      app: :banana,
      version: "0.1.0",
      elixir: "~> 1.11",
      start_permanent: Mix.env() == :prod,
      deps: deps()
    ]
  end

  # Run "mix help compile.app" to learn about applications.
  def application do
    [
      mod: {Banana, []},
      extra_applications: [:logger]
    ]
  end

  # Run "mix help deps" to learn about dependencies.
  defp deps do
    [
            # membrane
            {:membrane_core, "~> 0.6.1"},
            {:membrane_rtp_plugin, "~> 0.5.0"},
            {:membrane_element_udp, "~> 0.4.0"},
            {:membrane_h264_ffmpeg_plugin, "~> 0.7.0"},
            {:membrane_rtp_h264_plugin, "~> 0.4.0"},
            {:membrane_opus_plugin, "~> 0.2.1"},
            {:membrane_rtp_opus_plugin, "~> 0.2.0"},
            {:membrane_sdl_plugin, "~> 0.5.0"},
            {:membrane_portaudio_plugin, "~> 0.5.1"},
            {:membrane_hackney_plugin, "~> 0.4.0"},
            {:ex_libsrtp, "~> 0.1.0"},
            {:membrane_realtimer_plugin, "~> 0.1.0"},
            {:membrane_ffmpeg_swresample_plugin, "~> 0.5.0"},
            {:membrane_mp3_mad_plugin, "~> 0.5.0"}
      # {:dep_from_hexpm, "~> 0.3.0"},
      # {:dep_from_git, git: "https://github.com/elixir-lang/my_dep.git", tag: "0.1.0"}
    ]
  end
end

defmodule Banana do
  use Application

  def start(_type, _args) do
      alias Broth.RTP.ReceivePipeline

      {:ok, pid} =
        ReceivePipeline.start_link(%{
          audio_port: 20389
        })

      ReceivePipeline.play(pid)

      opts = [strategy: :one_for_one, name: Kousa.Supervisor]


    case Supervisor.start_link([], opts) do
      {:ok, pid} ->
        {:ok, pid}

      error ->
        error
    end
    end
end

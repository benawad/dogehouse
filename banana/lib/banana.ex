defmodule Banana do
  @moduledoc """
  Documentation for `Banana`.
  """

  @doc """
  Hello world.

  ## Examples

      iex> Banana.hello()
      :world

  """
    def playground() do
      alias Broth.RTP.ReceivePipeline

      {:ok, pid} =
        ReceivePipeline.start_link(%{
          audio_port: 27929
        })

      ReceivePipeline.play(pid)
    end
end

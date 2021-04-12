defmodule Broth.Message.Cast do
  @moduledoc """
  API contract statement for cast message modules
  """

  defmacro __using__(_) do
    quote do
      use Ecto.Schema
      import Ecto.Changeset

      @behaviour Broth.Message.Cast
    end
  end

  alias Broth.SocketHandler
  alias Ecto.Changeset

  @callback change_input(Broth.json) :: Ecto.Changeset.t
  
  @callback execute(Changeset.t, SocketHandler.state) ::
    {:noreply, SocketHandler.state} |
    {:error, map, SocketHandler.state} |
    {:error, Changeset.t} |
    {:exit, code :: 1000..9999, reason :: String.t}
end

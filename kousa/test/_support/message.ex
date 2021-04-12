defmodule BrothTest.Support.Message do
  import Ecto.Changeset
  alias Kousa.Utils.Errors

  def validate(message) do
    message
    |> Broth.Message.changeset()
    |> apply_action(:validate)
    |> case do
      {:ok, msg} ->
        case apply_action(msg.payload, :validate) do
          {:ok, payload} ->
            {:ok, %{msg | payload: payload}}

          {:error, changeset} ->
            {:error, %{msg | payload: %{}, errors: Errors.changeset_errors(changeset)}}
        end

      error ->
        error
    end
  end
end

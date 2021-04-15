defmodule BrothTest.Support.Message do
  import Ecto.Changeset
  alias Kousa.Utils.Errors

  import Kousa.Utils.Version, only: [sigil_v: 2]

  def validate(message, state \\ nil) do
    message
    # TODO: make this version match the mix project version.
    |> Map.put("version", ~v(0.2.0))
    |> Broth.Message.changeset(state)
    |> IO.inspect(label: "10")
    |> apply_action(:validate)
    |> IO.inspect(label: "11")
    |> case do
      {:ok, msg = %{errors: nil}} ->
        case apply_action(msg.payload, :validate) do
          {:ok, payload} ->
            {:ok, %{msg | payload: payload}}

          {:error, changeset} ->
            {:error, %{msg | payload: %{}, errors: Errors.changeset_errors(changeset)}}
        end

      # this one has errors
      {:ok, msg} ->
        {:error, msg}

      error ->
        error
    end
  end
end

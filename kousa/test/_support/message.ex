defmodule BrothTest.Support.Message do
  import Ecto.Changeset
  alias Kousa.Utils.Errors

  import Kousa.Utils.Version, only: [sigil_v: 2]

  @init %{user: %{id: UUID.uuid4()}}

  def validate(message, state \\ @init) do
    message
    # TODO: make this version match the mix project version.
    |> Map.put("version", ~v(0.2.0))
    |> Broth.Message.changeset(state)
    |> apply_action(:validate)
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

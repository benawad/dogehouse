defmodule Broth.Message.Room.Update do
  use Ecto.Schema

  @primary_key false
  embedded_schema do
    embeds_one(:room, Beef.Schemas.Room)
  end

  import Ecto.Changeset

  def changeset(changeset, data) do
    changeset
    |> change
    |> Map.put(:params, %{"room" => data})
    |> cast_embed(
      :room,
      required: true,
      # restrict modifications.
      with: {__MODULE__, :room_changeset, []}
    )
    |> assimilate_embed_errors
  end

  defp assimilate_embed_errors(changeset = %{valid?: true}), do: changeset

  defp assimilate_embed_errors(changeset = %{changes: %{room: inner_changeset}}) do
    %{changeset | errors: changeset.errors ++ inner_changeset.errors}
  end

  def room_changeset(changeset, data) do
    cast(changeset, data, ~w(description isPrivate name autoSpeaker)a)
  end

  defmodule Reply do
    use Ecto.Schema

    @derive {Jason.Encoder, only: ~w(room error)a}

    @primary_key false
    embedded_schema do
      embeds_one(:room, Beef.Schemas.Room)
      field(:error, :string)
    end
  end
end

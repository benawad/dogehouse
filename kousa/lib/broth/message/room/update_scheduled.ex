defmodule Broth.Message.Room.UpdateScheduled do
  use Broth.Message

  @primary_key false
  embedded_schema do
    embeds_one(:room, Beef.Schemas.ScheduledRoom)
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
    cast(changeset, data, ~w(description name scheduledFor)a)
  end

  defmodule Reply do
    use Broth.Message

    @primary_key false
    embedded_schema do
      embeds_one(:room, Beef.Schemas.Room)

      embed_error()
    end
  end
end

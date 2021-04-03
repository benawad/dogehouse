defmodule Broth.Message.User.Update do
  use Ecto.Schema

  @primary_key false
  embedded_schema do
    embeds_one(:user, Beef.Schemas.User)
  end

  import Ecto.Changeset

  def changeset(changeset, data) do
    changeset
    |> change
    |> Map.put(:params, %{"user" => data})
    |> cast_embed(
      :user,
      required: true,
      # restrict modifications.
      with: {__MODULE__, :user_changeset, []}
    )
    |> assimilate_embed_errors
  end

  defp assimilate_embed_errors(changeset = %{valid?: true}), do: changeset

  defp assimilate_embed_errors(changeset = %{changes: %{user: inner_changeset}}) do
    %{changeset | errors: changeset.errors ++ inner_changeset.errors}
  end

  def user_changeset(changeset, data) do
    cast(changeset, data, ~w(muted)a)
  end

  defmodule Reply do
    use Ecto.Schema

    @primary_key false
    embedded_schema do
      embeds_one(:room, Beef.Schemas.Room)
    end
  end
end

defmodule Broth.Utils do
  import Ecto.Changeset

  def validate_reply(changeset = %Ecto.Changeset{data: data = %module{}}) do
    :fields
    |> module.__schema__()
    |> Enum.reduce(changeset, &validate_type_of(&1, &2, data))
    |> apply_action!(:validate)
  end

  def validate_reply(reply = %module{}) do
    if function_exported?(module, :validate, 1) do
      reply
      |> module.validate
      |> validate_reply
    else
      reply
      |> change
      |> validate_reply
    end
  end

  defp validate_type_of(_, changeset = %{valid?: false}, _), do: changeset

  defp validate_type_of(field, changeset, %module{}) do
    case module.__schema__(:type, field) do
      :binary_id ->
        Kousa.Utils.UUID.normalize(changeset, field)

      {:parameterized, _, %{cardinality: :one, related: related}} ->
        if get_field(changeset, field).__struct__ == related do
          changeset
        else
          add_error(changeset, field, "is invalid")
        end
    end
  end
end

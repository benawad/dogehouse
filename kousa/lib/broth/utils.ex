defmodule Broth.Utils do
  import Ecto.Changeset

  def validate_reply!(reply = %module{}) when module != Ecto.Changeset do
    if function_exported?(module, :validate, 1) do
      reply
      |> change
      |> module.validate
      |> validate_reply!
    else
      reply
      |> change
      |> validate_reply!
    end
  end

  def validate_reply!(changeset = %Ecto.Changeset{data: %module{}}) do
    :fields
    |> module.__schema__()
    |> Enum.reduce(changeset, &validate_type_of(&2, &1))
    |> apply_action!(:validate)
  end

  def validate_type_of(changeset), do: changeset
  def validate_type_of(changeset = %{valid?: false}, _), do: changeset
  def validate_type_of(changeset = %{data: data = %module{}}, field) do
    value = :erlang.map_get(field, data)

    case module.__schema__(:type, field) do
      _ when value == nil ->
        changeset

      :binary_id ->
        Kousa.Utils.UUID.normalize(changeset, field)

      :boolean ->
        if not is_boolean(value) do
          raise "#{value} (field #{field}) is not boolean"
        end
        changeset

      {:parameterized, _, %{cardinality: :one, related: related}} ->
        if get_field(changeset, field).__struct__ == related do
          changeset
        else
          add_error(changeset, field, "is invalid")
        end

      other ->
        other |> IO.inspect(label: "43")
        raise "foo"
    end
  end
end

defmodule Broth.Utils do
  import Ecto.Changeset
  require Logger

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

  @basic_types [:binary_id, :boolean, :string]

  def validate_type_of(changeset = %{valid?: false}, _), do: changeset
  def validate_type_of(changeset = %{data: %module{}}, field) do
    funs = %{
      binary_id: &uuid?/1,
      boolean: &is_boolean/1,
      string: &is_binary/1
    }

    value = get_field(changeset, field)

    case module.__schema__(:type, field) do
      _ when value == nil ->
        changeset

      type when type in @basic_types ->
        validate(changeset, value, field, funs[type])

      {:array, type} when type in @basic_types ->
        Enum.reduce(
          value,
          changeset,
          &validate(&2, &1, field, funs[type]))

      {:parameterized, _, %{cardinality: :one, related: related}} ->
        if get_field(changeset, field).__struct__ == related do
          changeset
        else
          add_error(changeset, field, "is invalid")
        end

      other ->
        Logger.error("the type `#{inspect other}` has not been implemented in Broth.Utils.validate_type_of/2. Please implement it.")
        raise "unimplemented"
    end
  end

  def validate(changeset, value, field, fun) do
    if fun.(value) do
      changeset
    else
      add_error(changeset, field, "is invalid")
    end
  end

  defp uuid?(value) do
    match?({:ok, _}, Kousa.Utils.UUID.normalize(value))
  end

end

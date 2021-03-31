defmodule Broth.Contract do
  use Ecto.Schema

  embedded_schema do
    field(:operator, Broth.Contracts.Types.Operator, null: false)
    field(:payload, :map)
  end

  import Ecto.Changeset

  def changeset(source, data) do
    source
    |> change()
    |> Map.put(:params, data)
    |> find(:operator)
    |> find(:payload)
    |> cast_operator
    |> cast_payload
  end

  @valid_forms %{
    operator: ~w(operator op),
    payload: ~w(payload p d)
  }

  @operators %{
    "test_contract" => KousaTest.Broth.ContractTest.TestContract
  }

  defp find(changeset, field) when is_atom(field) do
    find(changeset, field, @valid_forms[field])
  end

  defp find(changeset = %{params: params}, field, [form | _])
      when is_map_key(params, form) do
    %{changeset | params: Map.put(changeset.params, "#{field}", params[form])}
  end

  defp find(changeset, field, [_ | rest]), do: find(changeset, field, rest)

  defp find(changeset, field, []) do
    add_error(changeset, field, "no #{field} present")
  end

  defp cast_operator(changeset) do
    operator = @operators[changeset.params["operator"]]
    cast(changeset, %{operator: operator}, [:operator])
  end

  defp cast_payload(changeset) do
    operator = get_field(changeset, :operator)

    operator
    |> struct
    |> operator.changeset(changeset.params["payload"])
    |> apply_action(:validate)
    |> case do
      {:ok, contract} -> put_change(changeset, :payload, contract)
      {:error, inner_changeset} ->
        %{changeset | errors: inner_changeset.errors, valid?: false}
    end
  end

  def validate(data) do
    %__MODULE__{}
    |> changeset(data)
    |> apply_action(:validate)
  end
end

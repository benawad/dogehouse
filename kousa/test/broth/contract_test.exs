defmodule KousaTest.Broth.ContractTest do
  use ExUnit.Case, async: true

  alias Broth.Contract

  defmodule TestContract do
    use Ecto.Schema

    embedded_schema do
      field(:foo, :integer, null: false)
    end

    import Ecto.Changeset

    def changeset(changeset, data) do
      changeset
      |> cast(data, [:foo])
      |> validate_number(:foo, not_equal_to: 42, message: "bad number")
    end
  end

  describe "for a generic contract" do
    @passing_contract %{
      "op" => "test_contract",
      "p" => %{"foo" => 47}
    }

    test "the contract system allows conversion" do
      assert {:ok,
              %Contract{
                operator: TestContract,
                payload: %TestContract{
                  foo: 47
                }
              }} = Contract.validate(@passing_contract)
    end

    @bad_data put_in(@passing_contract, ["p", "foo"], 42)

    test "the contract system fails for invalid data with correct struct" do
      assert {:error, %{
        errors: [foo: {"bad number", _}]
      }} = Contract.validate(@bad_data)
    end
  end
end

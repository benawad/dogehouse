defmodule BrothTest.MessageTest do

  @moduledoc "generic tests on the broth message systems"

  use ExUnit.Case, async: true

  alias Broth.Message

  defmodule TestOperator do
    use Ecto.Schema

    @primary_key false
    embedded_schema do
      # required, may not be 42.
      field(:foo, :integer)
    end

    import Ecto.Changeset

    def changeset(changeset, data) do
      changeset
      |> cast(data, [:foo])
      |> validate_number(:foo, not_equal_to: 42, message: "bad number")
      |> validate_required(:foo)
    end
  end

  @passing_contract %{
    "op" => "test_operator",
    "p" => %{"foo" => 47}
  }

  describe "for a generic contract" do
    test "the contract system allows conversion" do
      assert {:ok,
              %Message{
                operator: TestOperator,
                payload: %TestOperator{
                  foo: 47
                }
              }} = Message.validate(@passing_contract)
    end

    @bad_data put_in(@passing_contract, ["p", "foo"], 42)

    test "the contract system fails for invalid data with correct struct" do
      assert {:error,
              %{
                errors: [foo: {"bad number", _}]
              }} = Message.validate(@bad_data)
    end

    @missing_data put_in(@passing_contract, ["p"], %{})

    test "the contract system fails when payload data are omitted" do
      assert {:error, %{errors: [foo: {"can't be blank", _}]}} = Message.validate(@missing_data)
    end

    @invalid_data put_in(@passing_contract, ["p", "foo"], "bar")
    test "invalid datatypes are not accepted" do
      assert {:error, %{errors: [foo: {"is invalid", _}]}} = Message.validate(@invalid_data)
    end
  end

  describe "an invalid operator" do
    @operatorless Map.delete(@passing_contract, "op")

    test "because it's missing fails" do
      assert {:error, %{errors: [operator: {"no operator present", _}]}} =
               Message.validate(@operatorless)
    end

    @invalid_operator Map.put(@passing_contract, "op", "foobarbaz")

    test "because it's not implemented fails" do
      assert {:error, %{errors: [operator: {"is invalid", _}]}} =
               Message.validate(@invalid_operator)
    end
  end
end

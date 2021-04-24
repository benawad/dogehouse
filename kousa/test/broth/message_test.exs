defmodule BrothTest.MessageTest do
  @moduledoc "generic tests on the broth message systems"

  use ExUnit.Case, async: true

  alias Broth.Message

  defmodule TestOperator do
    use Broth.Message.Cast

    @primary_key false
    embedded_schema do
      # required, may not be 42.
      field(:foo, :integer)
    end

    import Ecto.Changeset

    def changeset(changeset \\ %__MODULE__{}, data) do
      changeset
      |> cast(data, [:foo])
      |> validate_number(:foo, not_equal_to: 42, message: "bad number")
      |> validate_required(:foo)
    end

    def execute(_, state), do: {:reply, %__MODULE__{}, state}
  end

  @passing_contract %{
    "op" => "test:operator",
    "p" => %{"foo" => 47},
    "v" => "0.2.0"
  }

  defp validate(data) do
    data
    |> Broth.Message.changeset(%{})
    |> Ecto.Changeset.apply_action(:validate)
  end

  describe "for a generic contract" do
    test "the contract system allows conversion" do
      assert {:ok,
              %Message{
                operator: TestOperator,
                payload: inner_changeset = %{valid?: true}
              }} = validate(@passing_contract)

      assert {:ok, %TestOperator{}} = Ecto.Changeset.apply_action(inner_changeset, :validate)
    end

    @bad_data put_in(@passing_contract, ["p", "foo"], 42)

    test "the contract system collapses inner errors into the message." do
      assert {:ok, %{errors: %{foo: "bad number"}}} = validate(@bad_data)
    end

    @missing_data put_in(@passing_contract, ["p"], %{})

    test "the contract system fails when payload data are omitted" do
      assert {:ok, %{errors: %{foo: "can't be blank"}}} = validate(@missing_data)
    end

    @invalid_data put_in(@passing_contract, ["p", "foo"], "bar")
    test "invalid datatypes are not accepted" do
      assert {:ok, %{errors: %{foo: "is invalid"}}} = validate(@invalid_data)
    end
  end

  describe "an invalid operator" do
    @operatorless Map.delete(@passing_contract, "op")

    test "because it's missing fails" do
      assert {:error, %{errors: [operator: {"no operator present", _}]}} = validate(@operatorless)
    end

    @invalid_operator Map.put(@passing_contract, "op", "foobarbaz")
    test "because it's not implemented fails" do
      assert {:error, %{errors: [operator: {"foobarbaz is invalid", _}]}} =
               validate(@invalid_operator)
    end
  end

  describe "an invalid version" do
    @versionless Map.delete(@passing_contract, "v")

    test "because it's missing fails" do
      assert {:error, %{errors: [version: {"no version present", _}]}} = validate(@versionless)
    end

    @invalid_version Map.put(@passing_contract, "v", "foobarbaz")
    test "because it's not implemented fails" do
      assert {:error, %{errors: [version: {"is invalid", _}]}} = validate(@invalid_version)
    end
  end
end

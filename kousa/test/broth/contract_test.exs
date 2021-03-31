defmodule KousaTest.Broth.ContractTest do
  use ExUnit.Case, async: true

  alias Broth.Contract

  defmodule TestContract do
    use Ecto.Schema

    embedded_schema do
      field :foo, :integer
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
          payload: %TestContract{
            foo: 47
          }}} = Contract.validate(@passing_contract)
    end
  end
end

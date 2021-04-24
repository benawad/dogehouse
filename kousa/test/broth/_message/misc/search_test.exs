defmodule BrothTest.Message.Misc.SearchTest do
  use ExUnit.Case, async: true

  @moduletag :message

  alias Broth.Message.Misc.Search

  setup do
    {:ok, uuid: UUID.uuid4()}
  end

  describe "when you send the search message" do
    test "you can specify a query of length 3", %{uuid: uuid} do
      assert {:ok,
              %{
                payload: %Search{query: "ben"},
                reference: ^uuid
              }} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "misc:search",
                 "payload" => %{query: "ben"},
                 "reference" => uuid
               })

      # short form also allowed
      assert {:ok,
              %{
                payload: %Search{query: "ben"},
                reference: ^uuid
              }} =
               BrothTest.Support.Message.validate(%{
                 "op" => "misc:search",
                 "p" => %{query: "ben"},
                 "ref" => uuid
               })
    end

    test "you can't specify query < 3", %{uuid: uuid} do
      assert {:error, %{errors: %{query: "should be at least %{count} character(s)"}}} =
               BrothTest.Support.Message.validate(%{
                 "op" => "misc:search",
                 "p" => %{"query" => "be"},
                 "ref" => uuid
               })
    end

    test "you can't specify query > 100", %{uuid: uuid} do
      assert {:error, %{errors: %{query: "should be at most %{count} character(s)"}}} =
               BrothTest.Support.Message.validate(%{
                 "op" => "misc:search",
                 "p" => %{
                   "query" =>
                     Enum.reduce(1..100, "", fn c, acc -> acc <> Integer.to_string(c) end)
                 },
                 "ref" => uuid
               })
    end

    test "you can't specify nonstrings for query", %{uuid: uuid} do
      assert {:error, %{errors: %{query: "is invalid"}}} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "misc:search",
                 "payload" => %{"query" => 0},
                 "reference" => uuid
               })
    end

    test "you must specify reference" do
      assert {:error, %{errors: [reference: {"is required for Broth.Message.Misc.Search", _}]}} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "misc:search",
                 "payload" => %{}
               })
    end
  end
end

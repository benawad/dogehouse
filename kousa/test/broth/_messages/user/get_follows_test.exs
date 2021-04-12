defmodule BrothTest.Message.User.GetFollowsTest do
  use ExUnit.Case, async: true

  @moduletag :message

  alias Broth.Message.User.GetFollows

  setup do
    {:ok, uuid: UUID.uuid4()}
  end

  describe "when you send a get_follows message" do
    test "it assumes cursor 0, limit 100", %{uuid: uuid} do
      assert {:ok,
              %{
                payload: %GetFollows{cursor: 0, limit: 100},
                reference: ^uuid
              }} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "user:get_follows",
                 "payload" => %{},
                 "reference" => uuid
               })

      # short form also allowed
      assert {:ok,
              %{
                payload: %GetFollows{cursor: 0, limit: 100},
                reference: ^uuid
              }} =
               BrothTest.Support.Message.validate(%{
                 "op" => "user:get_follows",
                 "p" => %{},
                 "ref" => uuid
               })
    end

    test "you can specify a different cursor value", %{uuid: uuid} do
      assert {:ok,
              %{
                payload: %GetFollows{cursor: 10}
              }} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "user:get_follows",
                 "payload" => %{"cursor" => 10},
                 "reference" => uuid
               })
    end

    test "you can specify a different limit value", %{uuid: uuid} do
      assert {:ok,
              %{
                payload: %GetFollows{limit: 50}
              }} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "user:get_follows",
                 "payload" => %{"limit" => 50},
                 "reference" => uuid
               })
    end

    test "you can't specify a limit == 0", %{uuid: uuid} do
      assert {:error, %{errors: [limit: {"too low", _}]}} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "user:get_follows",
                 "payload" => %{"limit" => 0},
                 "reference" => uuid
               })
    end

    test "you can't specify nonintegers for cursor or limit", %{uuid: uuid} do
      assert {:error, %{errors: [limit: {"is invalid", _}]}} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "user:get_follows",
                 "payload" => %{"limit" => "foo"},
                 "reference" => uuid
               })

      assert {:error, %{errors: [cursor: {"is invalid", _}]}} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "user:get_follows",
                 "payload" => %{"cursor" => "foo"},
                 "reference" => uuid
               })
    end

    test "you must specify reference" do
      assert {:error,
              %{errors: [reference: {"is required for Broth.Message.User.GetFollows", _}]}} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "user:get_follows",
                 "payload" => %{}
               })
    end
  end
end

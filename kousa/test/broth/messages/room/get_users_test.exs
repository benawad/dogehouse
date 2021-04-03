defmodule BrothTest.Message.Room.GetUsersTest do
  use ExUnit.Case, async: true

  alias Broth.Message.Room.GetUsers

  setup do
    {:ok, uuid: UUID.uuid4()}
  end

  describe "when you send the get_users message" do
    test "it assumes cursor 0, limit 100", %{uuid: uuid} do
      assert {:ok,
              %{
                payload: %GetUsers{cursor: 0, limit: 100},
                reference: ^uuid
              }} =
               Broth.Message.validate(%{
                 "operator" => "room:get_users",
                 "payload" => %{},
                 "reference" => uuid
               })

      # short form also allowed
      assert {:ok,
              %{
                payload: %GetUsers{cursor: 0, limit: 100},
                reference: ^uuid
              }} =
               Broth.Message.validate(%{
                 "op" => "room:get_users",
                 "p" => %{},
                 "ref" => uuid
               })
    end

    test "you can specify a different cursor value", %{uuid: uuid} do
      assert {:ok,
              %{
                payload: %GetUsers{cursor: 10}
              }} =
               Broth.Message.validate(%{
                 "operator" => "room:get_users",
                 "payload" => %{"cursor" => 10},
                 "reference" => uuid
               })
    end

    test "you can specify a different limit value", %{uuid: uuid} do
      assert {:ok,
              %{
                payload: %GetUsers{limit: 50}
              }} =
               Broth.Message.validate(%{
                 "operator" => "room:get_users",
                 "payload" => %{"limit" => 50},
                 "reference" => uuid
               })
    end

    test "you can't specify a limit == 0", %{uuid: uuid} do
      assert {:error, %{errors: [limit: {"too low", _}]}} =
               Broth.Message.validate(%{
                 "operator" => "room:get_users",
                 "payload" => %{"limit" => 0},
                 "reference" => uuid
               })
    end

    test "you can't specify nonintegers for cursor or limit", %{uuid: uuid} do
      assert {:error, %{errors: [limit: {"is invalid", _}]}} =
               Broth.Message.validate(%{
                 "operator" => "room:get_users",
                 "payload" => %{"limit" => "foo"},
                 "reference" => uuid
               })

      assert {:error, %{errors: [cursor: {"is invalid", _}]}} =
               Broth.Message.validate(%{
                 "operator" => "room:get_users",
                 "payload" => %{"cursor" => "foo"},
                 "reference" => uuid
               })
    end

    test "you must specify reference" do
      assert {:error,
              %{errors: [reference: {"is required for Broth.Message.Room.GetUsers", _}]}} =
               Broth.Message.validate(%{
                 "operator" => "room:get_users",
                 "payload" => %{}
               })
    end
  end
end

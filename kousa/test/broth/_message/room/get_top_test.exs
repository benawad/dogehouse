defmodule BrothTest.Message.Room.GetTopTest do
  use ExUnit.Case, async: true

  @moduletag :message

  alias Broth.Message.Room.GetTop

  setup do
    {:ok, uuid: UUID.uuid4()}
  end

  describe "when you send the room:get_top message" do
    test "it assumes cursor 0, limit 100", %{uuid: uuid} do
      assert {:ok,
              %{
                payload: %GetTop{cursor: 0, limit: 100},
                reference: ^uuid
              }} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "room:get_top",
                 "payload" => %{},
                 "reference" => uuid
               })

      # short form also allowed
      assert {:ok,
              %{
                payload: %GetTop{cursor: 0, limit: 100},
                reference: ^uuid
              }} =
               BrothTest.Support.Message.validate(%{
                 "op" => "room:get_top",
                 "p" => %{},
                 "ref" => uuid
               })
    end

    test "you can specify a different cursor value", %{uuid: uuid} do
      assert {:ok,
              %{
                payload: %GetTop{cursor: 10}
              }} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "room:get_top",
                 "payload" => %{"cursor" => 10},
                 "reference" => uuid
               })
    end

    test "you can specify a different limit value", %{uuid: uuid} do
      assert {:ok,
              %{
                payload: %GetTop{limit: 50}
              }} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "room:get_top",
                 "payload" => %{"limit" => 50},
                 "reference" => uuid
               })
    end

    test "you can't specify a limit == 0", %{uuid: uuid} do
      assert {:error, %{errors: %{limit: "too low"}}} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "room:get_top",
                 "payload" => %{"limit" => 0},
                 "reference" => uuid
               })
    end

    test "you can't specify nonintegers for cursor or limit", %{uuid: uuid} do
      assert {:error, %{errors: %{limit: "is invalid"}}} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "room:get_top",
                 "payload" => %{"limit" => "foo"},
                 "reference" => uuid
               })

      assert {:error, %{errors: %{cursor: "is invalid"}}} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "room:get_top",
                 "payload" => %{"cursor" => "foo"},
                 "reference" => uuid
               })
    end

    test "you must specify reference" do
      assert {:error, %{errors: [reference: {"is required for Broth.Message.Room.GetTop", _}]}} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "room:get_top",
                 "payload" => %{}
               })
    end
  end
end

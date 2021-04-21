defmodule BrothTest.Message.User.GetFollowingTest do
  use ExUnit.Case, async: true

  @moduletag :message

  alias Broth.Message.User.GetFollowing

  setup do
    {:ok, uuid: UUID.uuid4()}
  end

  describe "when you send a get_following message" do
    test "it assumes cursor 0, limit 100", %{uuid: uuid} do
      assert {:ok,
              %{
                payload: %GetFollowing{cursor: 0, limit: 100},
                reference: ^uuid
              }} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "user:get_following",
                 "payload" => %{},
                 "reference" => uuid
               })

      # short form also allowed
      assert {:ok,
              %{
                payload: %GetFollowing{cursor: 0, limit: 100},
                reference: ^uuid
              }} =
               BrothTest.Support.Message.validate(%{
                 "op" => "user:get_following",
                 "p" => %{},
                 "ref" => uuid
               })
    end

    test "you can specify a different cursor value", %{uuid: uuid} do
      assert {:ok,
              %{
                payload: %GetFollowing{cursor: 10}
              }} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "user:get_following",
                 "payload" => %{"cursor" => 10},
                 "reference" => uuid
               })
    end

    test "you can specify a different limit value", %{uuid: uuid} do
      assert {:ok,
              %{
                payload: %GetFollowing{limit: 50}
              }} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "user:get_following",
                 "payload" => %{"limit" => 50},
                 "reference" => uuid
               })
    end

    test "you can't specify a limit == 0", %{uuid: uuid} do
      assert {:error, %{errors: %{limit: "too low"}}} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "user:get_following",
                 "payload" => %{"limit" => 0},
                 "reference" => uuid
               })
    end

    test "you can't specify nonintegers for cursor or limit", %{uuid: uuid} do
      assert {:error, %{errors: %{limit: "is invalid"}}} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "user:get_following",
                 "payload" => %{"limit" => "foo"},
                 "reference" => uuid
               })

      assert {:error, %{errors: %{cursor: "is invalid"}}} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "user:get_following",
                 "payload" => %{"cursor" => "foo"},
                 "reference" => uuid
               })
    end

    test "you must specify reference" do
      assert {:error,
              %{errors: [reference: {"is required for Broth.Message.User.GetFollowing", _}]}} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "user:get_following",
                 "payload" => %{}
               })
    end
  end
end

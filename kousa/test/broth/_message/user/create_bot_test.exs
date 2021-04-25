defmodule BrothTest.Message.User.CreateBotTest do
  use ExUnit.Case, async: true

  @moduletag :message

  alias Broth.Message.User.CreateBot

  setup do
    {:ok, uuid: UUID.uuid4()}
  end

  describe "when you send create bot" do
    test "it populates create fields", %{uuid: uuid} do
      assert {:ok, %{payload: %CreateBot{username: "foobar"}}} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "user:create_bot",
                 "payload" => %{"username" => "foobar"},
                 "reference" => uuid
               })

      # short form also allowed
      assert {:ok, %{payload: %CreateBot{username: "foobar"}}} =
               BrothTest.Support.Message.validate(%{
                 "op" => "user:create_bot",
                 "p" => %{"username" => "foobar"},
                 "ref" => uuid
               })
    end

    test "omitting the reference is not allowed" do
      assert {:error, %{errors: [reference: {"is required for Broth.Message.User.CreateBot", _}]}} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "user:create_bot",
                 "payload" => %{"username" => "foobar"}
               })
    end

    test "providing the wrong datatype for username is disallowed", %{uuid: uuid} do
      assert {:error, %{errors: %{username: "is invalid"}}} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "user:create_bot",
                 "payload" => %{"username" => ["foobar", "barbaz"]},
                 "reference" => uuid
               })
    end
  end
end

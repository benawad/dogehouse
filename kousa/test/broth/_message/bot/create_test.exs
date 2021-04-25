defmodule BrothTest.Message.Room.CreateTest do
  use ExUnit.Case, async: true

  @moduletag :message

  alias Broth.Message.Bot.Create

  setup do
    {:ok, uuid: UUID.uuid4()}
  end

  describe "when you send create bot" do
    test "it populates create fields", %{uuid: uuid} do
      assert {:ok, %{payload: %Create{username: "foobar"}}} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "bot:create",
                 "payload" => %{"username" => "foobar"},
                 "reference" => uuid
               })

      # short form also allowed
      assert {:ok, %{payload: %Create{username: "foobar"}}} =
               BrothTest.Support.Message.validate(%{
                 "op" => "bot:create",
                 "p" => %{"username" => "foobar"},
                 "ref" => uuid
               })
    end

    test "omitting the reference is not allowed" do
      assert {:error, %{errors: [reference: {"is required for Broth.Message.Bot.Create", _}]}} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "bot:create",
                 "payload" => %{"username" => "foobar"}
               })
    end

    test "providing the wrong datatype for username is disallowed", %{uuid: uuid} do
      assert {:error, %{errors: %{username: "is invalid"}}} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "bot:create",
                 "payload" => %{"username" => ["foobar", "barbaz"]},
                 "reference" => uuid
               })
    end
  end
end

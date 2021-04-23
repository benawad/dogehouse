defmodule BrothTest.Message.Room.CreateTest do
  use ExUnit.Case, async: true

  @moduletag :message

  alias Broth.Message.Room.Create

  setup do
    {:ok, uuid: UUID.uuid4()}
  end

  describe "when you send an create message to change name" do
    test "it populates create fields", %{uuid: uuid} do
      assert {:ok, %{payload: %Create{name: "foobar"}}} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "room:create",
                 "payload" => %{"name" => "foobar", "description" => "a room"},
                 "reference" => uuid
               })

      # short form also allowed
      assert {:ok, %{payload: %Create{name: "foobar"}}} =
               BrothTest.Support.Message.validate(%{
                 "op" => "room:create",
                 "p" => %{"name" => "foobar", "description" => "a room"},
                 "ref" => uuid
               })
    end

    test "omitting the reference is not allowed" do
      assert {:error, %{errors: [reference: {"is required for Broth.Message.Room.Create", _}]}} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "room:create",
                 "payload" => %{"name" => "foobar", "description" => "a room"}
               })
    end

    test "providing the wrong datatype for name is disallowed", %{uuid: uuid} do
      assert {:error, %{errors: %{name: "is invalid"}}} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "room:create",
                 "payload" => %{"name" => ["foobar", "barbaz"], "description" => "a room"},
                 "reference" => uuid
               })
    end

    test "providing the wrong datatype for description is disallowed", %{uuid: uuid} do
      assert {:error, %{errors: %{description: "is invalid"}}} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "room:create",
                 "payload" => %{"name" => "foobar", "description" => ["a", "room"]},
                 "reference" => uuid
               })
    end
  end

  describe "when you send an create message with non-default privacy" do
    test "it validates", %{uuid: uuid} do
      assert {:ok, %{payload: %Create{isPrivate: true}}} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "room:create",
                 "payload" => %{
                   "isPrivate" => true,
                   "name" => "foobar",
                   "description" => "a room"
                 },
                 "reference" => uuid
               })
    end

    test "it fails if it's not a boolean", %{uuid: uuid} do
      assert {:error, %{errors: %{isPrivate: "is invalid"}}} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "room:create",
                 "payload" => %{
                   "isPrivate" => "barbaz",
                   "name" => "foobar",
                   "description" => "a room"
                 },
                 "reference" => uuid
               })
    end
  end

  describe "when you send an create message with autospeaker set" do
    test "it validates", %{uuid: uuid} do
      assert {:error, %{errors: %{autoSpeaker: "is invalid"}}} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "room:create",
                 "payload" => %{
                   "autoSpeaker" => "barbaz",
                   "name" => "foobar",
                   "description" => "a room"
                 },
                 "reference" => uuid
               })
    end
  end
end

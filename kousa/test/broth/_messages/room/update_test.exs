defmodule BrothTest.Message.Room.UpdateTest do
  use ExUnit.Case, async: true

  alias Beef.Schemas.Room
  alias Broth.Message.Room.Update

  setup do
    {:ok, uuid: UUID.uuid4()}
  end

  describe "when you send an update message to change name" do
    test "it populates update fields", %{uuid: uuid} do
      assert {:ok,
              %{
                payload: %Update{name: "foobar"}
              }} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "room:update",
                 "payload" => %{"name" => "foobar"},
                 "reference" => uuid
               })

      # short form also allowed
      assert {:ok,
              %{
                payload: %Update{name: "foobar"}
              }} =
               BrothTest.Support.Message.validate(%{
                 "op" => "room:update",
                 "p" => %{"name" => "foobar"},
                 "ref" => uuid
               })
    end

    test "omitting the reference is not allowed" do
      assert {:error, %{errors: [reference: {"is required for Broth.Message.Room.Update", _}]}} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "room:update",
                 "payload" => %{"name" => "foobar"}
               })
    end

    test "providing the wrong datatype for name is disallowed", %{uuid: uuid} do
      assert {:error, %{errors: [name: {"is invalid", _}]}} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "room:update",
                 "payload" => %{"name" => ["foobar", "barbaz"]},
                 "reference" => uuid
               })
    end
  end

  describe "when you send an update message to change description" do
    test "it validates", %{uuid: uuid} do
      assert {:ok,
              %{
                payload: %Update{description: "foobar"}
              }} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "room:update",
                 "payload" => %{"description" => "foobar"},
                 "reference" => uuid
               })
    end
  end

  describe "when you send an update message to change privacy" do
    test "it validates", %{uuid: uuid} do
      assert {:ok,
              %{
                payload: %Update{isPrivate: true}
              }} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "room:update",
                 "payload" => %{"isPrivate" => true},
                 "reference" => uuid
               })
    end
  end

  describe "when you send an update message to change autoSpeaker" do
    test "it validates", %{uuid: uuid} do
      assert {:ok,
              %{
                payload: %Update{autoSpeaker: true}
              }} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "room:update",
                 "payload" => %{"autoSpeaker" => true},
                 "reference" => uuid
               })
    end
  end
end

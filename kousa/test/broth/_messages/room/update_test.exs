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
                payload: %Update{room: %Room{name: "foobar"}}
              }} =
               Broth.Message.validate(%{
                 "operator" => "room:update",
                 "payload" => %{"name" => "foobar"},
                 "reference" => uuid
               })

      # short form also allowed
      assert {:ok,
              %{
                payload: %Update{room: %Room{name: "foobar"}}
              }} =
               Broth.Message.validate(%{
                 "op" => "room:update",
                 "p" => %{"name" => "foobar"},
                 "ref" => uuid
               })
    end

    test "omitting the reference is not allowed" do
      assert {:error, %{errors: [reference: {"is required for Broth.Message.Room.Update", _}]}} =
               Broth.Message.validate(%{
                 "operator" => "room:update",
                 "payload" => %{"name" => "foobar"}
               })
    end

    test "providing the wrong datatype for name is disallowed", %{uuid: uuid} do
      assert {:error, %{errors: [name: {"is invalid", _}]}} =
               Broth.Message.validate(%{
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
                payload: %Update{room: %Room{description: "foobar"}}
              }} =
               Broth.Message.validate(%{
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
                payload: %Update{room: %Room{isPrivate: true}}
              }} =
               Broth.Message.validate(%{
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
                payload: %Update{room: %Room{autoSpeaker: true}}
              }} =
               Broth.Message.validate(%{
                 "operator" => "room:update",
                 "payload" => %{"autoSpeaker" => true},
                 "reference" => uuid
               })
    end
  end
end

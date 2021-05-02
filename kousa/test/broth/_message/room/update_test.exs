defmodule BrothTest.Message.Room.UpdateTest do
  use ExUnit.Case, async: true
  use KousaTest.Support.EctoSandbox

  @moduletag :message

  alias Beef.Schemas.User
  alias Beef.Schemas.Room
  alias Broth.Message.Room.Update
  alias KousaTest.Support.Factory

  setup do
    user = Factory.create(User)
    _room = Factory.create(Room, creatorId: user.id)

    state = %Broth.SocketHandler{user: user}

    {:ok, uuid: UUID.uuid4(), state: state}
  end

  describe "when you send an update message" do
    test "it populates update fields", %{uuid: uuid, state: state} do
      assert {:ok, %{payload: %Update{name: "foobar"}}} =
               BrothTest.Support.Message.validate(
                 %{
                   "operator" => "room:update",
                   "payload" => %{"name" => "foobar"},
                   "reference" => uuid
                 },
                 state
               )

      # short form also allowed
      assert {:ok, %{payload: %Update{name: "foobar"}}} =
               BrothTest.Support.Message.validate(
                 %{
                   "op" => "room:update",
                   "p" => %{"name" => "foobar"},
                   "ref" => uuid
                 },
                 state
               )
    end

    test "omitting the reference is not allowed", %{state: state} do
      assert {:error, %{errors: [reference: {"is required for Broth.Message.Room.Update", _}]}} =
               BrothTest.Support.Message.validate(
                 %{
                   "operator" => "room:update",
                   "payload" => %{"name" => "foobar"}
                 },
                 state
               )
    end
  end

  describe "when you send an update message to change the name" do
    test "providing the wrong datatype for name is disallowed", %{uuid: uuid, state: state} do
      assert {:error, %{errors: %{name: "is invalid"}}} =
               BrothTest.Support.Message.validate(
                 %{
                   "operator" => "room:update",
                   "payload" => %{"name" => ["foobar", "barbaz"]},
                   "reference" => uuid
                 },
                 state
               )
    end

    test "empty name is disallowed", %{uuid: uuid, state: state} do
      assert {:error, %{errors: %{name: "can't be blank"}}} =
               BrothTest.Support.Message.validate(
                 %{
                   "operator" => "room:update",
                   "payload" => %{"name" => nil},
                   "reference" => uuid
                 },
                 state
               )

      assert {:error, %{errors: %{name: "can't be blank"}}} =
               BrothTest.Support.Message.validate(
                 %{
                   "operator" => "room:update",
                   "payload" => %{"name" => ""},
                   "reference" => uuid
                 },
                 state
               )
    end
  end

  describe "when you send an update message to change description" do
    test "it validates", %{uuid: uuid, state: state} do
      assert {:ok, %{payload: %Update{description: "foobar"}}} =
               BrothTest.Support.Message.validate(
                 %{
                   "operator" => "room:update",
                   "payload" => %{"description" => "foobar"},
                   "reference" => uuid
                 },
                 state
               )
    end
  end

  describe "when you send an update message to change privacy" do
    test "it validates", %{uuid: uuid, state: state} do
      assert {:ok, %{payload: %Update{isPrivate: true}}} =
               BrothTest.Support.Message.validate(
                 %{
                   "operator" => "room:update",
                   "payload" => %{"isPrivate" => true},
                   "reference" => uuid
                 },
                 state
               )
    end
  end

  describe "when you send an update message to change autoSpeaker" do
    test "it validates", %{uuid: uuid, state: state} do
      assert {:ok, %{payload: %Update{autoSpeaker: true}}} =
               BrothTest.Support.Message.validate(
                 %{
                   "operator" => "room:update",
                   "payload" => %{"autoSpeaker" => true},
                   "reference" => uuid
                 },
                 state
               )
    end
  end
end

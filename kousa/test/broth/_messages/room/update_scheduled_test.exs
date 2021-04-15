defmodule BrothTest.Message.Room.UpdateScheduledTest do
  use ExUnit.Case, async: true
  use KousaTest.Support.EctoSandbox

  @moduletag :message

  alias Beef.Schemas.ScheduledRoom
  alias Beef.Schemas.User
  alias Broth.Message.Room.UpdateScheduled
  alias KousaTest.Support.Factory

  setup do
    # TODO: make this a mock instead of a db dependency.
    user = Factory.create(User)
    room = Factory.create(ScheduledRoom, creatorId: user.id)

    {:ok, uuid: UUID.uuid4(), room: room}
  end

  describe "when you send an update message" do
    test "it populates update fields", %{uuid: uuid, room: room} do
      assert {:ok, %{payload: %UpdateScheduled{name: "foobar"}}} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "room:update_scheduled",
                 "payload" => %{"name" => "foobar", "id" => room.id},
                 "reference" => uuid
               })

      # short form also allowed
      assert {:ok, %{payload: %UpdateScheduled{name: "foobar"}}} =
               BrothTest.Support.Message.validate(%{
                 "op" => "room:update_scheduled",
                 "p" => %{"name" => "foobar", "id" => room.id},
                 "ref" => uuid
               })
    end

    test "omitting the reference is not allowed", %{room: room} do
      assert {:error,
              %{errors: [reference: {"is required for Broth.Message.Room.UpdateScheduled", _}]}} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "room:update_scheduled",
                 "payload" => %{"name" => "foobar", "id" => room.id}
               })
    end

    test "omitting the id is not allowed", %{uuid: uuid} do
      assert {:error, %{errors: %{id: "can't be blank"}}} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "room:update_scheduled",
                 "payload" => %{"name" => "foobar"},
                 "reference" => uuid
               })
    end

    test "an invalid id is not allowed", %{uuid: uuid} do
      assert {:error, %{errors: %{id: "room not found"}}} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "room:update_scheduled",
                 "payload" => %{"name" => "foobar", "id" => UUID.uuid4()},
                 "reference" => uuid
               })
    end
  end

  describe "when updating scheduled room name" do
    test "providing the wrong datatype for name is disallowed", %{uuid: uuid, room: room} do
      assert {:error, %{errors: %{name: "is invalid"}}} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "room:update_scheduled",
                 "payload" => %{"id" => room.id, "name" => ["foobar", "barbaz"]},
                 "reference" => uuid
               })
    end

    test "erasing the name is disallowed", %{uuid: uuid, room: room} do
      assert {:error, %{errors: %{name: "can't be blank"}}} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "room:update_scheduled",
                 "payload" => %{"name" => nil, "id" => room.id},
                 "reference" => uuid
               })

      assert {:error, %{errors: %{name: "can't be blank"}}} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "room:update_scheduled",
                 "payload" => %{"name" => "", "id" => room.id},
                 "reference" => uuid
               })
    end
  end

  describe "when you send an update message to change description" do
    test "it validates", %{uuid: uuid, room: room} do
      assert {:ok, %{payload: %UpdateScheduled{description: "foobar"}}} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "room:update_scheduled",
                 "payload" => %{"description" => "foobar", "id" => room.id},
                 "reference" => uuid
               })
    end
  end

  describe "when you send an update message to change scheduled time" do
    test "it validates", %{uuid: uuid, room: room} do
      time = DateTime.utc_now() |> DateTime.add(1, :second)

      assert {:ok, %{payload: %UpdateScheduled{scheduledFor: ^time}}} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "room:update_scheduled",
                 "payload" => %{"scheduledFor" => to_string(time), "id" => room.id},
                 "reference" => uuid
               })
    end

    test "it fails if it's not a proper time", %{uuid: uuid, room: room} do
      assert {:error, %{errors: %{scheduledFor: "is invalid"}}} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "room:update_scheduled",
                 "payload" => %{"scheduledFor" => "aaa", "id" => room.id},
                 "reference" => uuid
               })
    end

    test "it fails if it's in the past", %{uuid: uuid, room: room} do
      time = DateTime.utc_now() |> DateTime.add(-1, :second)

      assert {:error, %{errors: %{scheduledFor: "is in the past"}}} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "room:update_scheduled",
                 "payload" => %{"scheduledFor" => to_string(time), "id" => room.id},
                 "reference" => uuid
               })
    end
  end
end

defmodule BrothTest.Message.Room.UpdateScheduledTest do
  use ExUnit.Case, async: true

  alias Beef.Schemas.ScheduledRoom
  alias Broth.Message.Room.UpdateScheduled

  setup do
    {:ok, uuid: UUID.uuid4()}
  end

  describe "when you send an update message to change name" do
    test "it populates update fields", %{uuid: uuid} do
      assert {:ok,
              %{
                payload: %UpdateScheduled{room: %ScheduledRoom{name: "foobar"}}
              }} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "room:update_scheduled",
                 "payload" => %{"name" => "foobar"},
                 "reference" => uuid
               })

      # short form also allowed
      assert {:ok,
              %{
                payload: %UpdateScheduled{room: %ScheduledRoom{name: "foobar"}}
              }} =
               BrothTest.Support.Message.validate(%{
                 "op" => "room:update_scheduled",
                 "p" => %{"name" => "foobar"},
                 "ref" => uuid
               })
    end

    test "omitting the reference is not allowed" do
      assert {:error,
              %{errors: [reference: {"is required for Broth.Message.Room.UpdateScheduled", _}]}} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "room:update_scheduled",
                 "payload" => %{"name" => "foobar"}
               })
    end

    test "providing the wrong datatype for name is disallowed", %{uuid: uuid} do
      assert {:error, %{errors: [name: {"is invalid", _}]}} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "room:update_scheduled",
                 "payload" => %{"name" => ["foobar", "barbaz"]},
                 "reference" => uuid
               })
    end
  end

  describe "when you send an update message to change description" do
    test "it validates", %{uuid: uuid} do
      assert {:ok,
              %{
                payload: %UpdateScheduled{room: %ScheduledRoom{description: "foobar"}}
              }} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "room:update_scheduled",
                 "payload" => %{"description" => "foobar"},
                 "reference" => uuid
               })
    end
  end

  describe "when you send an update message to change scheduled time" do
    test "it validates", %{uuid: uuid} do
      time = DateTime.utc_now()

      assert {:ok,
              %{
                payload: %UpdateScheduled{room: %ScheduledRoom{scheduledFor: ^time}}
              }} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "room:update_scheduled",
                 "payload" => %{"scheduledFor" => to_string(time)},
                 "reference" => uuid
               })
    end

    test "it fails if it's not a proper time", %{uuid: uuid} do
      assert {:error, %{errors: [scheduledFor: {"is invalid", _}]}} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "room:update_scheduled",
                 "payload" => %{"scheduledFor" => "aaa"},
                 "reference" => uuid
               })
    end
  end
end

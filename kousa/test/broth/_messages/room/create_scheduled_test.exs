defmodule BrothTest.Message.Room.CreateScheduledTest do
  use ExUnit.Case, async: true

  @moduletag :message
  
  alias Beef.Schemas.ScheduledRoom
  alias Broth.Message.Room.CreateScheduled

  setup do
    {:ok, uuid: UUID.uuid4()}
  end

  describe "when you send an create_scheduled message to change name" do
    test "it populates create_scheduled fields", %{uuid: uuid} do
      assert {:ok,
              %{
                payload: %CreateScheduled{room: %ScheduledRoom{name: "foobar"}}
              }} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "room:create_scheduled",
                 "payload" => %{"name" => "foobar", "description" => "a room"},
                 "reference" => uuid
               })

      # short form also allowed
      assert {:ok,
              %{
                payload: %CreateScheduled{room: %ScheduledRoom{name: "foobar"}}
              }} =
               BrothTest.Support.Message.validate(%{
                 "op" => "room:create_scheduled",
                 "p" => %{"name" => "foobar", "description" => "a room"},
                 "ref" => uuid
               })
    end

    test "omitting the reference is not allowed" do
      assert {:error,
              %{errors: [reference: {"is required for Broth.Message.Room.CreateScheduled", _}]}} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "room:create_scheduled",
                 "payload" => %{"name" => "foobar", "description" => "a room"}
               })
    end

    test "providing the wrong datatype for name is disallowed", %{uuid: uuid} do
      assert {:error, %{errors: [name: {"is invalid", _}]}} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "room:create_scheduled",
                 "payload" => %{"name" => ["foobar", "barbaz"], "description" => "a room"},
                 "reference" => uuid
               })
    end

    test "providing the wrong datatype for description is disallowed", %{uuid: uuid} do
      assert {:error, %{errors: [description: {"is invalid", _}]}} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "room:create_scheduled",
                 "payload" => %{"name" => "foobar", "description" => ["a", "room"]},
                 "reference" => uuid
               })
    end
  end
end

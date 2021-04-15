defmodule BrothTest.Message.Room.CreateScheduledTest do
  use ExUnit.Case, async: true

  @moduletag :message

  alias Broth.Message.Room.CreateScheduled

  setup do
    future = DateTime.utc_now() |> DateTime.add(1, :second)
    {:ok, uuid: UUID.uuid4(), future: future}
  end

  describe "when you send an create_scheduled message" do
    test "it populates create_scheduled fields", %{uuid: uuid, future: future} do
      assert {:ok, %{payload: %CreateScheduled{name: "foobar"}}} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "room:create_scheduled",
                 "payload" => %{"name" => "foobar", "scheduledFor" => future},
                 "reference" => uuid
               })

      # short form also allowed
      assert {:ok, %{payload: %CreateScheduled{name: "foobar"}}} =
               BrothTest.Support.Message.validate(%{
                 "op" => "room:create_scheduled",
                 "p" => %{"name" => "foobar", "scheduledFor" => future},
                 "ref" => uuid
               })
    end

    test "omitting the reference is not allowed", %{future: future} do
      assert {:error,
              %{errors: [reference: {"is required for Broth.Message.Room.CreateScheduled", _}]}} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "room:create_scheduled",
                 "payload" => %{"name" => "foobar", "scheduledFor" => future}
               })
    end

    test "providing the wrong datatype for name is disallowed", %{uuid: uuid, future: future} do
      assert {:error, %{errors: %{name: "is invalid"}}} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "room:create_scheduled",
                 "payload" => %{"name" => ["foobar", "barbaz"], "scheduledFor" => future},
                 "reference" => uuid
               })
    end

    test "omitting the name is disallowed", %{uuid: uuid, future: future} do
      assert {:error, %{errors: %{name: "can't be blank"}}} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "room:create_scheduled",
                 "payload" => %{"scheduledFor" => future},
                 "reference" => uuid
               })
    end
  end

  describe "when you send an create_scheduled message the scheduledFor field" do
    test "strings are ok", %{uuid: uuid, future: future} do
      assert {:ok, %{payload: %CreateScheduled{scheduledFor: ^future}}} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "room:create_scheduled",
                 "payload" => %{"name" => "foobar", "scheduledFor" => "#{future}"},
                 "reference" => uuid
               })
    end

    test "providing the wrong datatype is disallowed", %{uuid: uuid} do
      assert {:error, %{errors: %{scheduledFor: "is invalid"}}} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "room:create_scheduled",
                 "payload" => %{"name" => "foobar", "scheduledFor" => "xxxx"},
                 "reference" => uuid
               })
    end

    test "omitting is disallowed", %{uuid: uuid} do
      assert {:error, %{errors: %{scheduledFor: "can't be blank"}}} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "room:create_scheduled",
                 "payload" => %{"name" => "foobar"},
                 "reference" => uuid
               })
    end

    test "a time in the past is disallowed", %{uuid: uuid} do
      past = DateTime.utc_now() |> DateTime.add(-1, :second)

      assert {:error, %{errors: %{scheduledFor: "is in the past"}}} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "room:create_scheduled",
                 "payload" => %{"name" => "foobar", "scheduledFor" => past},
                 "reference" => uuid
               })
    end
  end

  describe "when you send an create_scheduled message the description field" do
    test "providing a description is allowed", %{uuid: uuid, future: future} do
      assert {:ok, %{payload: %CreateScheduled{description: "barbaz"}}} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "room:create_scheduled",
                 "payload" => %{
                   "name" => "foobar",
                   "scheduledFor" => future,
                   "description" => "barbaz"
                 },
                 "reference" => uuid
               })
    end

    test "providing the wrong datatype for description is disallowed", %{
      uuid: uuid,
      future: future
    } do
      assert {:error, %{errors: %{description: "is invalid"}}} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "room:create_scheduled",
                 "payload" => %{
                   "name" => "foobar",
                   "scheduledFor" => future,
                   "description" => ["foo"]
                 },
                 "reference" => uuid
               })
    end
  end
end

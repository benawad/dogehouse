defmodule BrothTest.Message.Room.GetScheduledTest do
  use ExUnit.Case, async: true

  @moduletag :message

  alias Broth.Message.Room.GetScheduled

  setup do
    {:ok, uuid: UUID.uuid4()}
  end

  describe "when you send an get_scheduled message" do
    test "an empty payload is ok." do
      assert {:ok,
              %{
                payload: %GetScheduled{
                  range: "all",
                  userId: nil,
                  cursor: nil
                }
              }} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "room:get_scheduled",
                 "payload" => %{},
                 "reference" => UUID.uuid4()
               })

      # short form also allowed
      assert {:ok,
              %{
                payload: %GetScheduled{
                  range: "all",
                  userId: nil,
                  cursor: nil
                }
              }} =
               BrothTest.Support.Message.validate(%{
                 "op" => "room:get_scheduled",
                 "p" => %{},
                 "ref" => UUID.uuid4()
               })
    end
  end

  describe "for get_scheduled supplying range parameter" do
    test "supplying all directly is possible" do
      assert {:ok, %{payload: %GetScheduled{range: "all"}}} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "room:get_scheduled",
                 "payload" => %{"range" => "all"},
                 "reference" => UUID.uuid4()
               })
    end

    test "supplying upcoming is possible" do
      assert {:ok, %{payload: %GetScheduled{range: "upcoming"}}} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "room:get_scheduled",
                 "payload" => %{"range" => "upcoming"},
                 "reference" => UUID.uuid4()
               })
    end

    test "anything else is fail" do
      assert {:error, %{errors: %{range: "is invalid"}}} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "room:get_scheduled",
                 "payload" => %{"range" => "invalid"},
                 "reference" => UUID.uuid4()
               })
    end
  end

  describe "for get_scheduled supplying userId parameter" do
    test "supplying is possible" do
      uuid = UUID.uuid4()

      assert {:ok, %{payload: %GetScheduled{userId: ^uuid}}} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "room:get_scheduled",
                 "payload" => %{"userId" => uuid},
                 "reference" => UUID.uuid4()
               })
    end
  end

  describe "for get_scheduled supplying cursor parameter" do
    test "supplying cursor is possible" do
      assert {:ok, %{payload: %GetScheduled{cursor: 10}}} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "room:get_scheduled",
                 "payload" => %{"cursor" => 10},
                 "reference" => UUID.uuid4()
               })
    end
  end
end

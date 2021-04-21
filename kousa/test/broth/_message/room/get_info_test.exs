defmodule BrothTest.Message.Room.GetInfoTest do
  use ExUnit.Case, async: true

  @moduletag :message

  alias Broth.Message.Room.GetInfo

  setup do
    {:ok, uuid: UUID.uuid4()}
  end

  describe "when you send an leave message" do
    test "an empty payload is ok.", %{uuid: uuid} do
      assert {:ok, %{payload: %GetInfo{roomId: ^uuid}}} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "room:get_info",
                 "payload" => %{roomId: uuid},
                 "reference" => UUID.uuid4()
               })

      # short form also allowed
      assert {:ok, %{payload: %GetInfo{roomId: ^uuid}}} =
               BrothTest.Support.Message.validate(%{
                 "op" => "room:get_info",
                 "p" => %{roomId: uuid},
                 "ref" => UUID.uuid4()
               })
    end

    test "roomId parameter is required" do
      assert {:ok, %{payload: %GetInfo{roomId: nil}}} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "room:get_info",
                 "payload" => %{},
                 "reference" => UUID.uuid4()
               })
    end
  end
end

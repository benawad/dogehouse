defmodule BrothTest.Message.Room.GetInfoTest do
  use ExUnit.Case, async: true

  alias Broth.Message.Room.GetInfo

  setup do
    {:ok, uuid: UUID.uuid4()}
  end

  describe "when you send an leave message" do
    test "an empty payload is ok.", %{uuid: uuid} do
      assert {:ok,
              %{
                payload: %GetInfo{roomId: ^uuid}
              }} =
               Broth.Message.validate(%{
                 "operator" => "room:get_info",
                 "payload" => %{roomId: uuid},
                 "reference" => UUID.uuid4()
               })

      # short form also allowed
      assert {:ok,
              %{
                payload: %GetInfo{roomId: ^uuid}
              }} =
               Broth.Message.validate(%{
                 "op" => "room:get_info",
                 "p" => %{roomId: uuid},
                 "ref" => UUID.uuid4()
               })
    end

    test "roomId parameter is required" do
      assert {:error, %{errors: [roomId: {"can't be blank", _}]}} =
               Broth.Message.validate(%{
                 "operator" => "room:get_info",
                 "payload" => %{},
                 "reference" => UUID.uuid4()
               })
    end
  end
end

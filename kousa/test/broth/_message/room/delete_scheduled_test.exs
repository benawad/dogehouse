defmodule BrothTest.Message.Room.DeleteScheduledTest do
  use ExUnit.Case, async: true

  @moduletag :message

  alias Broth.Message.Room.DeleteScheduled

  setup do
    {:ok, uuid: UUID.uuid4()}
  end

  describe "when you send a delete_scheduled message" do
    test "it populates roomId", %{uuid: uuid} do
      assert {:ok,
              %{
                payload: %DeleteScheduled{roomId: ^uuid}
              }} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "room:delete_scheduled",
                 "payload" => %{"roomId" => uuid},
                 "reference" => UUID.uuid4()
               })

      # short form also allowed
      assert {:ok,
              %{
                payload: %DeleteScheduled{roomId: ^uuid}
              }} =
               BrothTest.Support.Message.validate(%{
                 "op" => "room:delete_scheduled",
                 "p" => %{"roomId" => uuid},
                 "ref" => UUID.uuid4()
               })
    end

    test "omitting the reference is not allowed", %{uuid: uuid} do
      assert {:error,
              %{errors: [reference: {"is required for Broth.Message.Room.DeleteScheduled", _}]}} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "room:delete_scheduled",
                 "payload" => %{"roomId" => uuid}
               })
    end

    test "omitting the roomId is not allowed" do
      assert {:error, %{errors: %{roomId: "can't be blank"}}} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "room:delete_scheduled",
                 "payload" => %{},
                 "reference" => UUID.uuid4()
               })
    end

    test "roomId must be a UUID" do
      assert {:error, %{errors: %{roomId: "is invalid"}}} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "room:delete_scheduled",
                 "payload" => %{"roomId" => "aaa"},
                 "reference" => UUID.uuid4()
               })
    end
  end
end

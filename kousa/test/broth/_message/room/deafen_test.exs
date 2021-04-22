defmodule BrothTest.Message.Room.DeafenTest do
  use ExUnit.Case, async: true

  @moduletag :message

  alias Broth.Message.Room.Deafen

  setup do
    {:ok, uuid: UUID.uuid4()}
  end

  describe "when you send an room:deafen message" do
    test "an empty payload is ok.", %{uuid: uuid} do
      assert {:ok, %{payload: %Deafen{deafen: true}}} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "room:deafen",
                 "payload" => %{deafen: true},
                 "reference" => uuid
               })

      # short form also allowed
      assert {:ok, %{payload: %Deafen{deafen: false}}} =
               BrothTest.Support.Message.validate(%{
                 "op" => "room:deafen",
                 "p" => %{deafen: false},
                 "ref" => uuid
               })
    end

    test "deafen parameter is required", %{uuid: uuid} do
      assert {:error, %{errors: %{deafen: "can't be blank"}}} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "room:deafen",
                 "payload" => %{},
                 "reference" => uuid
               })
    end

    test "reference is required" do
      assert {:error, %{errors: [reference: {"is required for Broth.Message.Room.Deafen", _}]}} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "room:deafen",
                 "payload" => %{"deafen" => true}
               })
    end
  end
end

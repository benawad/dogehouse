defmodule BrothTest.Message.Room.DeafenTest do
  use ExUnit.Case, async: true

  @moduletag :message

  alias Broth.Message.Room.Deafen

  setup do
    {:ok, uuid: UUID.uuid4()}
  end

  describe "when you send an room:deafen message" do
    test "an empty payload is ok.", %{uuid: uuid} do
      assert {:ok, %{payload: %Deafen{deafened: true}}} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "room:deafen",
                 "payload" => %{deafened: true},
                 "reference" => uuid
               })

      # short form also allowed
      assert {:ok, %{payload: %Deafen{deafened: false}}} =
               BrothTest.Support.Message.validate(%{
                 "op" => "room:deafen",
                 "p" => %{deafened: false},
                 "ref" => uuid
               })
    end

    test "deafen parameter is required", %{uuid: uuid} do
      assert {:error, %{errors: %{deafened: "can't be blank"}}} =
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
                 "payload" => %{"deafened" => true}
               })
    end
  end
end

defmodule BrothTest.Message.Room.MuteTest do
  use ExUnit.Case, async: true

  @moduletag :message

  alias Broth.Message.Room.Mute

  setup do
    {:ok, uuid: UUID.uuid4()}
  end

  describe "when you send an room:mute message" do
    test "an empty payload is ok.", %{uuid: uuid} do
      assert {:ok, %{payload: %Mute{muted: true}}} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "room:mute",
                 "payload" => %{muted: true},
                 "reference" => uuid
               })

      # short form also allowed
      assert {:ok, %{payload: %Mute{muted: false}}} =
               BrothTest.Support.Message.validate(%{
                 "op" => "room:mute",
                 "p" => %{muted: false},
                 "ref" => uuid
               })
    end

    test "muted parameter is required", %{uuid: uuid} do
      assert {:error, %{errors: %{muted: "can't be blank"}}} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "room:mute",
                 "payload" => %{},
                 "reference" => uuid
               })
    end

    test "reference is required" do
      assert {:error, %{errors: [reference: {"is required for Broth.Message.Room.Mute", _}]}} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "room:mute",
                 "payload" => %{"muted" => true}
               })
    end
  end
end

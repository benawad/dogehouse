defmodule BrothTest.Message.Room.SetActiveSpeakerTest do
  use ExUnit.Case, async: true
  use KousaTest.Support.EctoSandbox

  alias Broth.Message.Room.SetActiveSpeaker

  describe "when you send a room:set_active_speaker message" do
    test "a basic message works" do
      assert {:ok, %{payload: %SetActiveSpeaker{active: true}}} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "room:set_active_speaker",
                 "payload" => %{active: true}
               })

      # short form also allowed
      assert {:ok, %{payload: %SetActiveSpeaker{active: false}}} =
               BrothTest.Support.Message.validate(%{
                 "op" => "room:set_active_speaker",
                 "p" => %{active: false}
               })
    end

    test "active parameter is required" do
      assert {:error, %{errors: %{active: "can't be blank"}}} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "room:set_active_speaker",
                 "payload" => %{}
               })
    end
  end
end

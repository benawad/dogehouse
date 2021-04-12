defmodule BrothTest.Message.Room.LeaveTest do
  use ExUnit.Case, async: true

  @moduletag :message

  alias Broth.Message.Room.Leave

  describe "when you send an leave message" do
    test "an empty payload is ok, but requires ref" do
      assert {:ok,
              %{
                payload: %Leave{}
              }} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "room:leave",
                 "payload" => %{},
                 "reference" => UUID.uuid4()
               })

      # short form also allowed
      assert {:ok,
              %{
                payload: %Leave{}
              }} =
               BrothTest.Support.Message.validate(%{
                 "op" => "room:leave",
                 "p" => %{},
                 "ref" => UUID.uuid4()
               })
    end
  end
end

defmodule BrothTest.Message.Room.LeaveTest do
  use ExUnit.Case, async: true

  alias Broth.Message.Room.Leave

  describe "when you send an leave message" do
    test "an empty payload is ok." do
      assert {:ok,
              %{
                payload: %Leave{}
              }} =
               Broth.Message.validate(%{
                 "operator" => "room:leave",
                 "payload" => %{}
               })

      # short form also allowed
      assert {:ok,
              %{
                payload: %Leave{}
              }} =
               Broth.Message.validate(%{
                 "op" => "room:leave",
                 "p" => %{}
               })
    end
  end
end

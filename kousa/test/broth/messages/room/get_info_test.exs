defmodule BrothTest.Message.Room.GetInfoTest do
  use ExUnit.Case, async: true

  alias Broth.Message.Room.GetInfo

  describe "when you send an leave message" do
    test "an empty payload is ok." do
      assert {:ok,
              %{
                payload: %GetInfo{}
              }} =
               Broth.Message.validate(%{
                 "operator" => "room:get_info",
                 "payload" => %{},
                 "reference" => UUID.uuid4()
               })

      # short form also allowed
      assert {:ok,
              %{
                payload: %GetInfo{}
              }} =
               Broth.Message.validate(%{
                 "op" => "room:get_info",
                 "p" => %{},
                 "ref" => UUID.uuid4()
               })
    end
  end
end

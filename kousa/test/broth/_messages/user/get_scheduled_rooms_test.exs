defmodule BrothTest.Message.User.GetScheduledRoomsTest do
  use ExUnit.Case, async: true

  alias Broth.Message.User.GetScheduledRooms

  describe "when you send an get_scheduled_rooms message" do
    test "an empty payload is ok." do
      ref = UUID.uuid4()

      assert {:ok,
              %{
                payload: %GetScheduledRooms{},
                reference: ^ref
              }} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "user:get_scheduled_rooms",
                 "payload" => %{},
                 "reference" => ref
               })

      # short form also allowed
      assert {:ok,
              %{
                payload: %GetScheduledRooms{},
                reference: ^ref
              }} =
               BrothTest.Support.Message.validate(%{
                 "op" => "user:get_scheduled_rooms",
                 "p" => %{},
                 "ref" => ref
               })
    end
  end
end

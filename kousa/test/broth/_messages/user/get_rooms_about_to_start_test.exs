defmodule BrothTest.Message.User.GetRoomsAboutToStartTest do
  use ExUnit.Case, async: true

  alias Broth.Message.User.GetRoomsAboutToStart

  describe "when you send an get_about_to_start message" do
    test "an empty payload is ok." do
      ref = UUID.uuid4()

      assert {:ok,
              %{
                payload: %GetRoomsAboutToStart{},
                reference: ^ref
              }} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "user:get_rooms_about_to_start",
                 "payload" => %{},
                 "reference" => ref
               })

      # short form also allowed
      assert {:ok,
              %{
                payload: %GetRoomsAboutToStart{},
                reference: ^ref
              }} =
               BrothTest.Support.Message.validate(%{
                 "op" => "user:get_rooms_about_to_start",
                 "p" => %{},
                 "ref" => ref
               })
    end
  end
end

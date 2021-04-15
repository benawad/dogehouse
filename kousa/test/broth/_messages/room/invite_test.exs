defmodule BrothTest.Message.Room.InviteTest do
  use ExUnit.Case, async: true

  @moduletag :message

  alias Broth.Message.Room.Invite

  setup do
    {:ok, uuid: UUID.uuid4()}
  end

  describe "when you send an invite message" do
    test "it populates userId", %{uuid: uuid} do
      assert {:ok,
              %{
                payload: %Invite{userId: ^uuid}
              }} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "room:invite",
                 "payload" => %{"userId" => uuid}
               })

      # short form also allowed
      assert {:ok,
              %{
                payload: %Invite{userId: ^uuid}
              }} =
               BrothTest.Support.Message.validate(%{
                 "op" => "room:invite",
                 "p" => %{"userId" => uuid}
               })
    end

    test "omitting the userId is not allowed" do
      assert {:error, %{errors: %{userId: "can't be blank"}}} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "room:invite",
                 "payload" => %{}
               })
    end
  end
end

defmodule BrothTest.Message.Chat.UnbanTest do
  use ExUnit.Case, async: true

  @moduletag :message

  alias Broth.Message.Chat.Unban

  setup do
    {:ok, uuid: UUID.uuid4()}
  end

  describe "when you send a block message" do
    test "it populates userId", %{uuid: uuid} do
      assert {:ok,
              %{
                payload: %Unban{userId: ^uuid}
              }} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "chat:unban",
                 "payload" => %{"userId" => uuid}
               })

      # short form also allowed
      assert {:ok,
              %{
                payload: %Unban{userId: ^uuid}
              }} =
               BrothTest.Support.Message.validate(%{
                 "op" => "chat:unban",
                 "p" => %{"userId" => uuid}
               })
    end

    test "omitting the userId is not allowed" do
      assert {:error, %{errors: %{userId: "can't be blank"}}} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "chat:unban",
                 "payload" => %{}
               })
    end
  end
end

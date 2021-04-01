defmodule BrothTest.Message.Chat.BlockTest do
  use ExUnit.Case, async: true

  alias Broth.Message.Chat.Block

  setup do
    {:ok, uuid: UUID.uuid4()}
  end

  describe "when you send a block message" do
    test "it populates userId", %{uuid: uuid} do
      assert {:ok,
              %{
                payload: %Block{userId: ^uuid}
              }} =
               Broth.Message.validate(%{
                 "operator" => "chat:block",
                 "payload" => %{"userId" => uuid}
               })

      # short form also allowed
      assert {:ok,
              %{
                payload: %Block{userId: ^uuid}
              }} =
               Broth.Message.validate(%{
                 "op" => "chat:block",
                 "p" => %{"userId" => uuid}
               })
    end

    test "omitting the userId is not allowed" do
      assert {:error, %{errors: [userId: {"can't be blank", _}]}} =
               Broth.Message.validate(%{
                 "operator" => "chat:block",
                 "payload" => %{}
               })
    end
  end
end

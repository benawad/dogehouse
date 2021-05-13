defmodule BrothTest.Message.User.GetBotsTest do
  use ExUnit.Case, async: true

  @moduletag :message

  alias Broth.Message.User.GetBots

  setup do
    {:ok, uuid: UUID.uuid4()}
  end

  describe "when you send an get_bots message" do
    test "omitting the reference is not allowed", %{uuid: uuid} do
      assert {:error, %{errors: [reference: {"is required for Broth.Message.User.GetBots", _}]}} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "user:get_bots",
                 "payload" => %{"userId" => uuid}
               })
    end
  end
end

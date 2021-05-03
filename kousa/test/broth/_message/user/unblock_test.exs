defmodule BrothTest.Message.User.UnblockTest do
  use ExUnit.Case, async: true

  @moduletag :message

  alias Broth.Message.User.Unblock

  setup do
    {:ok, uuid: UUID.uuid4()}
  end

  describe "when you send an ban message" do
    test "it populates userId", %{uuid: uuid} do
      assert {:ok,
              %{
                payload: %Unblock{userId: ^uuid}
              }} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "user:unblock",
                 "payload" => %{"userId" => uuid},
                 "reference" => UUID.uuid4()
               })

      # short form also allowed
      assert {:ok,
              %{
                payload: %Unblock{userId: ^uuid}
              }} =
               BrothTest.Support.Message.validate(%{
                 "op" => "user:unblock",
                 "p" => %{"userId" => uuid},
                 "ref" => UUID.uuid4()
               })
    end

    test "omitting the userId is not allowed" do
      assert {:error, %{errors: %{userId: "can't be blank"}}} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "user:unblock",
                 "payload" => %{},
                 "reference" => UUID.uuid4()
               })
    end

    test "omitting the reference is not allowed", %{uuid: uuid} do
      assert {:error, %{errors: [reference: {"is required for Broth.Message.User.Unblock", _}]}} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "user:unblock",
                 "payload" => %{"userId" => uuid}
               })
    end
  end
end

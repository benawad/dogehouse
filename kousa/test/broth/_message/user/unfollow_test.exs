defmodule BrothTest.Message.User.UnfollowTest do
  use ExUnit.Case, async: true

  @moduletag :message

  alias Broth.Message.User.Unfollow

  setup do
    {:ok, uuid: UUID.uuid4()}
  end

  describe "when you send an unfollow message" do
    test "it populates userId", %{uuid: uuid} do
      assert {:ok,
              %{
                payload: %Unfollow{userId: ^uuid}
              }} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "user:unfollow",
                 "payload" => %{"userId" => uuid},
                 "reference" => UUID.uuid4()
               })

      # short form also allowed
      assert {:ok,
              %{
                payload: %Unfollow{userId: ^uuid}
              }} =
               BrothTest.Support.Message.validate(%{
                 "op" => "user:unfollow",
                 "p" => %{"userId" => uuid},
                 "ref" => UUID.uuid4()
               })
    end

    test "omitting the userId is not allowed" do
      assert {:error, %{errors: %{userId: "can't be blank"}}} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "user:unfollow",
                 "payload" => %{},
                 "reference" => UUID.uuid4()
               })
    end

    test "omitting the reference is not allowed", %{uuid: uuid} do
      assert {:error, %{errors: [reference: {"is required for Broth.Message.User.Unfollow", _}]}} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "user:unfollow",
                 "payload" => %{"userId" => uuid}
               })
    end
  end
end

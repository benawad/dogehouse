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
                 "payload" => %{"userId" => uuid}
               })

      # short form also allowed
      assert {:ok,
              %{
                payload: %Unfollow{userId: ^uuid}
              }} =
               BrothTest.Support.Message.validate(%{
                 "op" => "user:unfollow",
                 "p" => %{"userId" => uuid}
               })
    end

    test "omitting the userId is not allowed" do
      assert {:error, %{errors: %{userId: "can't be blank"}}} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "user:unfollow",
                 "payload" => %{}
               })
    end
  end
end

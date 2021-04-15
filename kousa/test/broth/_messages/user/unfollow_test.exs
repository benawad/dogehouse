defmodule BrothTest.Message.User.UnfollowTest do
  use ExUnit.Case, async: true

  @moduletag :message

  alias Broth.Message.User.Unfollow

  setup do
    {:ok, uuid: UUID.uuid4()}
  end

  describe "when you send an unfollow message" do
    test "it populates id", %{uuid: uuid} do
      assert {:ok,
              %{
                payload: %Unfollow{id: ^uuid}
              }} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "user:unfollow",
                 "payload" => %{"id" => uuid}
               })

      # short form also allowed
      assert {:ok,
              %{
                payload: %Unfollow{id: ^uuid}
              }} =
               BrothTest.Support.Message.validate(%{
                 "op" => "user:unfollow",
                 "p" => %{"id" => uuid}
               })
    end

    test "omitting the id is not allowed" do
      assert {:error, %{errors: [id: {"can't be blank", _}]}} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "user:unfollow",
                 "payload" => %{}
               })
    end
  end
end

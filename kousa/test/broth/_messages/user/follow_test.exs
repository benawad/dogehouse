defmodule BrothTest.Message.User.FollowTest do
  use ExUnit.Case, async: true

  @moduletag :message

  alias Broth.Message.User.Follow

  setup do
    {:ok, uuid: UUID.uuid4()}
  end

  describe "when you send an follow message" do
    test "it populates id", %{uuid: uuid} do
      assert {:ok,
              %{
                payload: %Follow{id: ^uuid}
              }} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "user:follow",
                 "payload" => %{"id" => uuid}
               })

      # short form also allowed
      assert {:ok,
              %{
                payload: %Follow{id: ^uuid}
              }} =
               BrothTest.Support.Message.validate(%{
                 "op" => "user:follow",
                 "p" => %{"id" => uuid}
               })
    end

    test "omitting the id is not allowed" do
      assert {:error, %{errors: %{id: "can't be blank"}}} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "user:follow",
                 "payload" => %{}
               })
    end
  end
end

defmodule BrothTest.Message.User.FollowTest do
  use ExUnit.Case, async: true

  alias Broth.Message.User.Follow

  setup do
    {:ok, uuid: UUID.uuid4()}
  end

  describe "when you send an follow message" do
    test "it populates followId", %{uuid: uuid} do
      assert {:ok,
              %{
                payload: %Follow{followId: ^uuid}
              }} =
               Broth.Message.validate(%{
                 "operator" => "user:follow",
                 "payload" => %{"followId" => uuid}
               })

      # short form also allowed
      assert {:ok,
              %{
                payload: %Follow{followId: ^uuid}
              }} =
               Broth.Message.validate(%{
                 "op" => "user:follow",
                 "p" => %{"followId" => uuid}
               })
    end

    test "omitting the followId is not allowed" do
      assert {:error, %{errors: [followId: {"can't be blank", _}]}} =
               Broth.Message.validate(%{
                 "operator" => "user:follow",
                 "payload" => %{}
               })
    end
  end
end

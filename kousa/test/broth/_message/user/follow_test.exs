defmodule BrothTest.Message.User.FollowTest do
  use ExUnit.Case, async: true

  @moduletag :message

  alias Broth.Message.User.Follow

  setup do
    {:ok, uuid: UUID.uuid4()}
  end

  describe "when you send an follow message" do
    test "it populates userId", %{uuid: uuid} do
      assert {:ok,
              %{
                payload: %Follow{userId: ^uuid}
              }} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "user:follow",
                 "payload" => %{"userId" => uuid},
                 "reference" => UUID.uuid4()
               })

      # short form also allowed
      assert {:ok,
              %{
                payload: %Follow{userId: ^uuid}
              }} =
               BrothTest.Support.Message.validate(%{
                 "op" => "user:follow",
                 "p" => %{"userId" => uuid},
                 "ref" => UUID.uuid4()
               })
    end

    test "omitting the userId is not allowed" do
      assert {:error, %{errors: %{userId: "can't be blank"}}} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "user:follow",
                 "payload" => %{},
                 "reference" => UUID.uuid4()
               })
    end

    test "omitting the reference is not allowed", %{uuid: uuid} do
      assert {:error, %{errors: [reference: {"is required for Broth.Message.User.Follow", _}]}} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "user:follow",
                 "payload" => %{"userId" => uuid}
               })
    end
  end
end

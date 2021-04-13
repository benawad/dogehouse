defmodule BrothTest.Message.Room.SetRole do
  use ExUnit.Case, async: true

  @moduletag :message

  alias Broth.Message.Room.SetRole

  setup do
    {:ok, uuid: UUID.uuid4()}
  end

  test "reactivate these"

  describe "when you send an set role message to speaker" do
    test "it validates", %{uuid: uuid} do
      assert {:ok,
              %{
                payload: %SetRole{userId: ^uuid, role: :speaker}
              }} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "room:set_role",
                 "payload" => %{"userId" => uuid, "role" => "speaker"}
               })

      # short form also allowed
      assert {:ok,
              %{
                payload: %SetRole{userId: ^uuid, role: :speaker}
              }} =
               BrothTest.Support.Message.validate(%{
                 "op" => "room:set_role",
                 "p" => %{"userId" => uuid, "role" => "speaker"}
               })
    end

    test "omitting the userId is not allowed" do
      assert {:error, %{errors: [userId: {"can't be blank", _}]}} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "room:set_role",
                 "payload" => %{"role" => "speaker"}
               })
    end

    test "omitting the role is not allowed", %{uuid: uuid} do
      assert {:error, %{errors: [role: {"can't be blank", _}]}} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "room:set_role",
                 "payload" => %{"userId" => uuid}
               })
    end
  end

  describe "when you send an set role message to" do
    test "raised hand it validates", %{uuid: uuid} do
      assert {:ok,
              %{
                payload: %SetRole{userId: ^uuid, role: :raised_hand}
              }} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "room:set_role",
                 "payload" => %{"userId" => uuid, "role" => "raised_hand"}
               })
    end

    test "listener it validates", %{uuid: uuid} do
      assert {:ok,
              %{
                payload: %SetRole{userId: ^uuid, role: :listener}
              }} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "room:set_role",
                 "payload" => %{"userId" => uuid, "role" => "listener"}
               })
    end
  end
end

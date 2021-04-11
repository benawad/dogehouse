defmodule BrothTest.Message.Room.SetRole do
  use ExUnit.Case, async: true

  alias Broth.Message.Room.SetRole

  setup do
    {:ok, uuid: UUID.uuid4()}
  end

  describe "when you send an set role message to speaker" do
    test "it validates", %{uuid: uuid} do
      assert {:ok,
              %{
                payload: %SetRole{userId: ^uuid, role: :speaker}
              }} =
               Broth.Message.validate(%{
                 "operator" => "room:set_role",
                 "payload" => %{"userId" => uuid, "role" => "speaker"}
               })

      # short form also allowed
      assert {:ok,
              %{
                payload: %SetRole{userId: ^uuid, role: :speaker}
              }} =
               Broth.Message.validate(%{
                 "op" => "room:set_role",
                 "p" => %{"userId" => uuid, "role" => "speaker"}
               })
    end

    test "omitting the userId is not allowed" do
      assert {:error, %{errors: [userId: {"can't be blank", _}]}} =
               Broth.Message.validate(%{
                 "operator" => "room:set_role",
                 "payload" => %{"role" => "speaker"}
               })
    end

    test "omitting the role is not allowed", %{uuid: uuid} do
      assert {:error, %{errors: [role: {"can't be blank", _}]}} =
               Broth.Message.validate(%{
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
               Broth.Message.validate(%{
                 "operator" => "room:set_role",
                 "payload" => %{"userId" => uuid, "role" => "raised_hand"}
               })
    end

    test "listener it validates", %{uuid: uuid} do
      assert {:ok,
              %{
                payload: %SetRole{userId: ^uuid, role: :listener}
              }} =
               Broth.Message.validate(%{
                 "operator" => "room:set_role",
                 "payload" => %{"userId" => uuid, "role" => "listener"}
               })
    end

    test "creator it validates", %{uuid: uuid} do
      assert {:ok,
              %{
                payload: %SetRole{userId: ^uuid, role: :creator}
              }} =
               Broth.Message.validate(%{
                 "operator" => "room:set_role",
                 "payload" => %{"userId" => uuid, "role" => "creator"}
               })
    end
  end
end

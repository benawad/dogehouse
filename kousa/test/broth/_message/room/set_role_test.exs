defmodule BrothTest.Message.Room.SetRole do
  use ExUnit.Case, async: true

  @moduletag :message

  alias Broth.Message.Room.SetRole

  setup do
    state = %{user_id: UUID.uuid4()}
    {:ok, uuid: UUID.uuid4(), state: state}
  end

  describe "when you send an set role message to speaker" do
    test "it validates", %{uuid: uuid, state: state} do
      assert {:ok,
              %{
                payload: %SetRole{userId: ^uuid, role: :speaker}
              }} =
               BrothTest.Support.Message.validate(
                 %{
                   "operator" => "room:set_role",
                   "payload" => %{"userId" => uuid, "role" => "speaker"}
                 },
                 state
               )

      # short form also allowed
      assert {:ok,
              %{
                payload: %SetRole{userId: ^uuid, role: :speaker}
              }} =
               BrothTest.Support.Message.validate(
                 %{
                   "op" => "room:set_role",
                   "p" => %{"userId" => uuid, "role" => "speaker"}
                 },
                 state
               )
    end

    test "zeroing out the userId is not allowed", %{state: state} do
      assert {:error, %{errors: %{userId: "can't be blank"}}} =
               BrothTest.Support.Message.validate(
                 %{
                   "operator" => "room:set_role",
                   "payload" => %{"role" => "speaker", "userId" => nil}
                 },
                 state
               )

      assert {:error, %{errors: %{userId: "can't be blank"}}} =
               BrothTest.Support.Message.validate(
                 %{
                   "operator" => "room:set_role",
                   "payload" => %{"role" => "speaker", "userId" => ""}
                 },
                 state
               )
    end

    test "if you don't supply the userId, it's treated as self", %{state: state = %{user_id: id}} do
      assert {:ok, %{payload: %SetRole{userId: ^id}}} =
               BrothTest.Support.Message.validate(
                 %{
                   "operator" => "room:set_role",
                   "payload" => %{"role" => "speaker"}
                 },
                 state
               )
    end
  end

  describe "when you send an set role message to" do
    test "raised hand it validates", %{uuid: uuid, state: state} do
      assert {:ok,
              %{
                payload: %SetRole{userId: ^uuid, role: :raised_hand}
              }} =
               BrothTest.Support.Message.validate(
                 %{
                   "operator" => "room:set_role",
                   "payload" => %{"userId" => uuid, "role" => "raised_hand"}
                 },
                 state
               )
    end

    test "listener it validates", %{uuid: uuid, state: state} do
      assert {:ok,
              %{
                payload: %SetRole{userId: ^uuid, role: :listener}
              }} =
               BrothTest.Support.Message.validate(
                 %{
                   "operator" => "room:set_role",
                   "payload" => %{"userId" => uuid, "role" => "listener"}
                 },
                 state
               )
    end
  end
end

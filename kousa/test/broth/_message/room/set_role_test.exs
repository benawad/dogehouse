defmodule BrothTest.Message.Room.SetRoleTest do
  use ExUnit.Case, async: true

  @moduletag :message

  alias Broth.Message.Room.SetRole

  setup do
    state = %{user: %{id: UUID.uuid4()}}
    {:ok, state: state}
  end

  describe "when you send an set role message to speaker" do
    test "it validates", %{state: state} do
      user_id = state.user.id

      assert {:ok,
              %{
                payload: %SetRole{userId: ^user_id, role: :speaker}
              }} =
               BrothTest.Support.Message.validate(
                 %{
                   "operator" => "room:set_role",
                   "payload" => %{"userId" => user_id, "role" => "speaker"}
                 },
                 state
               )

      # short form also allowed
      assert {:ok,
              %{
                payload: %SetRole{userId: ^user_id, role: :speaker}
              }} =
               BrothTest.Support.Message.validate(
                 %{
                   "op" => "room:set_role",
                   "p" => %{"userId" => user_id, "role" => "speaker"}
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

    test "if you don't supply the userId, it's treated as self", %{state: state} do
      user_id = state.user.id

      assert {:ok, %{payload: %SetRole{userId: ^user_id}}} =
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
    test "raised hand it validates", %{state: state} do
      user_id = state.user.id

      assert {:ok,
              %{
                payload: %SetRole{userId: ^user_id, role: :raised_hand}
              }} =
               BrothTest.Support.Message.validate(
                 %{
                   "operator" => "room:set_role",
                   "payload" => %{"userId" => user_id, "role" => "raised_hand"}
                 },
                 state
               )
    end

    test "listener it validates", %{state: state} do
      user_id = state.user.id

      assert {:ok,
              %{
                payload: %SetRole{userId: ^user_id, role: :listener}
              }} =
               BrothTest.Support.Message.validate(
                 %{
                   "operator" => "room:set_role",
                   "payload" => %{"userId" => user_id, "role" => "listener"}
                 },
                 state
               )
    end
  end
end

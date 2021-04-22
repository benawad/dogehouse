defmodule BrothTest.Message.Room.GetBannedUsersTest do
  use ExUnit.Case, async: true

  @moduletag :message

  alias Broth.Message.Room.GetBannedUsers

  @user_id UUID.uuid4()
  @room_id UUID.uuid4()

  setup do
    {:ok, uuid: UUID.uuid4(), state: %{data_source: __MODULE__, user_id: @user_id}}
  end

  def get_current_room_id(_), do: @room_id

  describe "when you send the get_banned_users message" do
    test "it assumes cursor 0, limit 100", %{uuid: uuid, state: state} do
      assert {:ok,
              %{
                payload: %GetBannedUsers{cursor: 0, limit: 100},
                reference: ^uuid
              }} =
               BrothTest.Support.Message.validate(
                 %{
                   "operator" => "room:get_banned_users",
                   "payload" => %{},
                   "reference" => uuid
                 },
                 state
               )

      # short form also allowed
      assert {:ok,
              %{
                payload: %GetBannedUsers{cursor: 0, limit: 100},
                reference: ^uuid
              }} =
               BrothTest.Support.Message.validate(
                 %{
                   "op" => "room:get_banned_users",
                   "p" => %{},
                   "ref" => uuid
                 },
                 state
               )
    end

    test "you can specify a different cursor value", %{uuid: uuid, state: state} do
      assert {:ok,
              %{
                payload: %GetBannedUsers{cursor: 10}
              }} =
               BrothTest.Support.Message.validate(
                 %{
                   "operator" => "room:get_banned_users",
                   "payload" => %{"cursor" => 10},
                   "reference" => uuid
                 },
                 state
               )
    end

    test "you can specify a different limit value", %{uuid: uuid, state: state} do
      assert {:ok,
              %{
                payload: %GetBannedUsers{limit: 50}
              }} =
               BrothTest.Support.Message.validate(
                 %{
                   "operator" => "room:get_banned_users",
                   "payload" => %{"limit" => 50},
                   "reference" => uuid
                 },
                 state
               )
    end

    test "you can't specify a limit == 0", %{uuid: uuid, state: state} do
      assert {:error, %{errors: %{limit: "too low"}}} =
               BrothTest.Support.Message.validate(
                 %{
                   "operator" => "room:get_banned_users",
                   "payload" => %{"limit" => 0},
                   "reference" => uuid
                 },
                 state
               )
    end

    test "you can't specify nonintegers for cursor or limit", %{uuid: uuid, state: state} do
      assert {:error, %{errors: %{limit: "is invalid"}}} =
               BrothTest.Support.Message.validate(
                 %{
                   "operator" => "room:get_banned_users",
                   "payload" => %{"limit" => "foo"},
                   "reference" => uuid
                 },
                 state
               )

      assert {:error, %{errors: %{cursor: "is invalid"}}} =
               BrothTest.Support.Message.validate(
                 %{
                   "operator" => "room:get_banned_users",
                   "payload" => %{"cursor" => "foo"},
                   "reference" => uuid
                 },
                 state
               )
    end

    test "you must specify reference, state: state", %{state: state} do
      assert {:error,
              %{errors: [reference: {"is required for Broth.Message.Room.GetBannedUsers", _}]}} =
               BrothTest.Support.Message.validate(
                 %{
                   "operator" => "room:get_banned_users",
                   "payload" => %{}
                 },
                 state
               )
    end
  end
end

defmodule BrothTest.JoinRoomAndGetInfoTest do
  use ExUnit.Case, async: true
  use KousaTest.Support.EctoSandbox

  alias Beef.Schemas.User
  alias Beef.Users
  alias BrothTest.WsClient
  alias BrothTest.WsClientFactory
  alias KousaTest.Support.Factory

  require WsClient

  setup do
    user = Factory.create(User)
    client_ws = WsClientFactory.create_client_for(user)

    {:ok, user: user, client_ws: client_ws}
  end

  describe "the websocket join_room_and_get_info operation" do
    test "can be used to join a room", t do
      user_id = t.user.id

      %{"id" => room_id} =
        WsClient.do_call(
          t.client_ws,
          "room:create",
          %{"name" => "foo room", "description" => "foo"}
        )

      # make sure the user is in there.
      assert %{currentRoomId: ^room_id} = Users.get_by_id(user_id)

      # create a user that is logged in.
      joiner = %{id: joiner_id} = Factory.create(User)
      joiner_ws = WsClientFactory.create_client_for(joiner)

      ref =
        WsClient.send_call_legacy(
          joiner_ws,
          "join_room_and_get_info",
          %{"roomId" => room_id}
        )

      WsClient.assert_reply_legacy(
        ref,
        %{
          "roomId" => ^room_id,
          "room" => %{"id" => ^room_id},
          "users" => users = [_, _]
        },
        joiner_ws
      )

      assert Enum.any?(users, &match?(%{"id" => ^user_id}, &1))
      assert Enum.any?(users, &match?(%{"id" => ^joiner_id}, &1))

      WsClient.assert_frame_legacy(
        "new_user_join_room",
        %{"roomId" => ^room_id, "user" => %{"id" => ^joiner_id}},
        t.client_ws
      )

      # TODO: do a test to check to make sure the muted state is correct
    end

    @tag :skip
    test "does what if you're already in the room"
  end
end

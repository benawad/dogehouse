defmodule BrothTest.InviteToRoomTest do
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

  describe "the websocket invite_to_room operation" do
    test "invites that person to a room", t do
      %{"id" => room_id} =
        WsClient.do_call(
          t.client_ws,
          "room:create",
          %{"name" => "foo room", "description" => "foo"}
        )

      # make sure the user is in there.
      assert %{currentRoomId: ^room_id} = Users.get_by_id(t.user.id)

      # create a follower user that is logged in.
      follower = %{id: follower_id} = Factory.create(User)
      follower_ws = WsClientFactory.create_client_for(follower)
      Kousa.Follow.follow(follower_id, t.user.id, true)

      WsClient.send_msg_legacy(t.client_ws, "invite_to_room", %{"userId" => follower_id})

      # note this comes from the follower's client
      WsClient.assert_frame_legacy("invitation_to_room", %{"roomId" => ^room_id}, follower_ws)
    end
  end
end

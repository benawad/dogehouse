defmodule KousaTest.Broth.Ws.InviteToRoomTest do
  use ExUnit.Case, async: true
  use Kousa.Support.EctoSandbox

  alias Beef.Schemas.User
  alias Beef.Users
  alias Broth.WsClient
  alias Kousa.Support.Factory

  require WsClient

  setup do
    user = Factory.create(User)
    tokens = Kousa.Utils.TokenUtils.create_tokens(user)

    # start and link the websocket client
    ws_client = start_supervised!(WsClient)
    Process.link(ws_client)
    WsClient.forward_frames(ws_client)

    WsClient.send_msg(ws_client, "auth", %{
      "accessToken" => tokens.accessToken,
      "refreshToken" => tokens.refreshToken,
      "platform" => "foo",
      "reconnectToVoice" => false,
      "muted" => false
    })

    WsClient.assert_frame("auth-good", _)

    {:ok, user: user, ws_client: ws_client}
  end

  describe "the websocket invite_to_room operation" do
    test "invites that person to a room", t do
      # first, create a room owned by the primary user.
      {:ok, %{room: %{id: room_id}}} = Kousa.Room.create_room(t.user.id, "foo room", "foo", false)
      # make sure the user is in there.
      assert %{currentRoomId: ^room_id} = Users.get_by_id(t.user.id)

      # TODO:  break this out to its own thing.
      follower = %{id: follower_id} = Factory.create(User)
      # build out a second WS connection around this guy.
      follower_tokens = Kousa.Utils.TokenUtils.create_tokens(follower)

      # start and link the websocket client
      follower_client = start_supervised!(WsClient)
      Process.link(follower_client)
      WsClient.forward_frames(follower_client)

      # authorize the follower
      WsClient.send_msg(follower_client, "auth", %{
        "accessToken" => follower_tokens.accessToken,
        "refreshToken" => follower_tokens.refreshToken,
        "platform" => "foo",
        "reconnectToVoice" => false,
        "muted" => false
      })

      WsClient.assert_frame("auth-good", %{"user" => %{"id" => ^follower_id}})

      # note that the other user must be a follower.
      Kousa.Follow.follow(follower_id, t.user.id, true)

      WsClient.send_msg(t.ws_client, "invite_to_room", %{"userId" => follower_id})

      # note this comes from the follower's client
      WsClient.assert_frame("invitation_to_room", %{"roomId" => ^room_id})
    end
  end
end

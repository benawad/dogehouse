defmodule KousaTest.Broth.Ws.MakeRoomPublicTest do
  use ExUnit.Case, async: true
  use Kousa.Support.EctoSandbox

  alias Beef.Schemas.User
  alias Beef.Users
  alias Beef.Rooms
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

  describe "the websocket make_room_public operation" do
    test "makes the room public", t do
      # first, create a room owned by the primary user.
      {:ok, %{room: %{id: room_id}}} = Kousa.Room.create_room(t.user.id, "foo room", "foo", true)
      # make sure the user is in there.
      assert %{currentRoomId: ^room_id} = Users.get_by_id(t.user.id)
      # make sure the room is private

      assert Rooms.get_room_by_id(room_id).isPrivate

      WsClient.send_msg(t.ws_client, "make_room_public", %{"newName" => "quux room"})

      WsClient.assert_frame("room_privacy_change", %{"name" => "quux room", "isPrivate" => false})

      # make sure the room is actually private
      assert %{
        isPrivate: false,
        name: "quux room"
      } = Rooms.get_room_by_id(room_id)
    end
  end
end

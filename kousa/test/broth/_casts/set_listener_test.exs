defmodule KousaTest.Broth.SetListenerTest do
  use ExUnit.Case, async: true
  use Kousa.Support.EctoSandbox

  alias Beef.Schemas.User
  alias Beef.Users
  alias Broth.WsClient
  alias Broth.WsClientFactory
  alias Kousa.Support.Factory

  require WsClient

  setup do
    user = Factory.create(User)
    client_ws = WsClientFactory.create_client_for(user)

    {:ok, user: user, client_ws: client_ws}
  end

  describe "the websocket set_listener operation" do
    test "takes a speaker and turns them into listener", t do
      # first, create a room owned by the test user.
      {:ok, %{room: %{id: room_id}}} = Kousa.Room.create_room(t.user.id, "foo room", "foo", false)
      # make sure the user is in there.
      assert %{currentRoomId: ^room_id} = Users.get_by_id(t.user.id)

      # create a speaker user that is logged in.
      speaker = %{id: speaker_id} = Factory.create(User)
      speaker_ws = WsClientFactory.create_client_for(speaker)

      # join the speaker user into the room
      Kousa.Room.join_room(speaker_id, room_id)
      WsClient.assert_frame("new_user_join_room", _)

      Beef.RoomPermissions.set_speaker(t.user.id, room_id, true)

      assert Beef.RoomPermissions.speaker?(t.user.id, room_id)

      WsClient.send_msg(t.client_ws, "set_listener", %{"userId" => speaker_id})

      WsClient.assert_frame(
        "speaker_removed",
        %{"roomId" => ^room_id, "userId" => ^speaker_id},
        t.client_ws
      )

      WsClient.assert_frame(
        "speaker_removed",
        %{"roomId" => ^room_id, "userId" => ^speaker_id},
        speaker_ws
      )

      refute Beef.RoomPermissions.speaker?(speaker_id, room_id)
    end
  end
end

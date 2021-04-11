defmodule KousaTest.Broth.AskToSpeakTest do
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

  describe "the websocket ask_to_speak operation" do
    test "poromotes the person to ask_to_speak", t do
      # first, create a room owned by the primary user.
      {:ok, %{room: %{id: room_id}}} = Kousa.Room.create_room(t.user.id, "foo room", "foo", false)
      # make sure the user is in there.
      assert %{currentRoomId: ^room_id} = Users.get_by_id(t.user.id)

      # create a user that is logged in.
      speaker = %{id: speaker_id} = Factory.create(User)
      speaker_ws = WsClientFactory.create_client_for(speaker)

      # join the speaker user into the room
      Kousa.Room.join_room(speaker_id, room_id)

      WsClient.assert_frame("new_user_join_room", %{"user" => %{"id" => ^speaker_id}})

      # make the ask_to_speak request
      WsClient.send_msg(speaker_ws, "ask_to_speak", %{})

      # both clients get notified
      WsClient.assert_frame(
        "hand_raised",
        %{"userId" => ^speaker_id, "roomId" => ^room_id},
        t.client_ws
      )

      WsClient.assert_frame(
        "hand_raised",
        %{"userId" => ^speaker_id, "roomId" => ^room_id},
        speaker_ws
      )

      refute Beef.RoomPermissions.speaker?(speaker_id, room_id)
    end
  end
end

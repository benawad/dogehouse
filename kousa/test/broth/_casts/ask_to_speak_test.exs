defmodule BrothTest.AskToSpeakTest do
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

  describe "the websocket ask_to_speak operation" do
    test "poromotes the person to ask_to_speak", t do
      %{"id" => room_id} =
        WsClient.do_call(
          t.client_ws,
          "room:create",
          %{"name" => "foo room", "description" => "foo"}
        )

      # make sure the user is in there.
      assert %{currentRoomId: ^room_id} = Users.get_by_id(t.user.id)

      # create a user that is logged in.
      speaker = %{id: speaker_id} = Factory.create(User)
      speaker_ws = WsClientFactory.create_client_for(speaker)

      # join the speaker user into the room
      WsClient.do_call(speaker_ws, "room:join", %{"roomId" => room_id})

      WsClient.assert_frame_legacy("new_user_join_room", %{"user" => %{"id" => ^speaker_id}})

      # make the ask_to_speak request
      WsClient.send_msg_legacy(speaker_ws, "ask_to_speak", %{})

      # both clients get notified
      WsClient.assert_frame_legacy(
        "hand_raised",
        %{"userId" => ^speaker_id, "roomId" => ^room_id},
        t.client_ws
      )

      WsClient.assert_frame_legacy(
        "hand_raised",
        %{"userId" => ^speaker_id, "roomId" => ^room_id},
        speaker_ws
      )

      refute Beef.RoomPermissions.speaker?(speaker_id, room_id)
    end
  end
end

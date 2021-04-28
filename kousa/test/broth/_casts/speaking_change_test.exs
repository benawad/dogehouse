defmodule BrothTest.SpeakingChangeTest do
  use ExUnit.Case, async: true
  use KousaTest.Support.EctoSandbox

  alias Beef.Schemas.User
  alias BrothTest.WsClient
  alias BrothTest.WsClientFactory
  alias KousaTest.Support.Factory

  require WsClient

  setup do
    user = Factory.create(User)
    client_ws = WsClientFactory.create_client_for(user)

    %{"id" => room_id} =
      WsClient.do_call(
        client_ws,
        "room:create",
        %{"name" => "foo room", "description" => "foo"}
      )

    {:ok, user: user, client_ws: client_ws, room_id: room_id}
  end

  describe "the websocket speaking_change operation" do
    test "toggles the active speaking state", t do
      room_id = t.room_id

      # add a second user to the test
      other = Factory.create(User)
      other_ws = WsClientFactory.create_client_for(other)
      WsClient.do_call(other_ws, "room:join", %{"roomId" => room_id})

      WsClient.assert_frame_legacy("new_user_join_room", _)

      assert %{} = Onion.RoomSession.get(room_id, :activeSpeakerMap)

      WsClient.send_msg_legacy(
        t.client_ws,
        "speaking_change",
        %{"value" => true}
      )

      # both websockets will be informed
      WsClient.assert_frame_legacy(
        "active_speaker_change",
        %{"activeSpeakerMap" => map},
        t.client_ws
      )

      assert is_map_key(map, t.user.id)

      WsClient.assert_frame_legacy(
        "active_speaker_change",
        %{"activeSpeakerMap" => map},
        other_ws
      )

      assert is_map_key(map, t.user.id)

      map = Onion.RoomSession.get(room_id, :activeSpeakerMap)

      assert is_map_key(map, t.user.id)

      Process.sleep(100)

      WsClient.send_msg_legacy(
        t.client_ws,
        "speaking_change",
        %{"value" => false}
      )

      WsClient.assert_frame_legacy(
        "active_speaker_change",
        %{"activeSpeakerMap" => map},
        t.client_ws
      )

      refute is_map_key(map, t.user.id)

      WsClient.assert_frame_legacy(
        "active_speaker_change",
        %{"activeSpeakerMap" => map},
        other_ws
      )

      refute is_map_key(map, t.user.id)

      map = Onion.RoomSession.get(room_id, :activeSpeakerMap)

      refute is_map_key(map, t.user.id)
    end

    test "does nothing if it's unset", t do
      room_id = t.room_id

      # add a second user to the test
      other = Factory.create(User)
      other_ws = WsClientFactory.create_client_for(other)
      WsClient.do_call(other_ws, "room:join", %{"roomId" => room_id})

      WsClient.assert_frame_legacy("new_user_join_room", _)

      Onion.RoomSession.get(room_id, :activeSpeakerMap)

      WsClient.send_msg_legacy(
        t.client_ws,
        "speaking_change",
        %{"value" => false}
      )

      WsClient.assert_frame_legacy(
        "active_speaker_change",
        %{"activeSpeakerMap" => map}
      )

      assert map == %{}

      map = Onion.RoomSession.get(room_id, :activeSpeakerMap)

      assert map == %{}
    end
  end
end

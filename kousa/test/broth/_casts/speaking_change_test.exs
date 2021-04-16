defmodule KousaTest.Broth.SpeakingChangeTest do
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

    {:ok, user: user, client_ws: client_ws}
  end

  describe "the websocket speaking_change operation" do
    test "toggles the active speaking state", t do
      user_id = t.user.id

      {:ok, %{room: room}} = Kousa.Room.create_room(user_id, "foo room", "foobar", false)

      # add a second user to the test
      other = %{id: other_id} = Factory.create(User)
      other_ws = WsClientFactory.create_client_for(other)
      Kousa.Room.join_room(other_id, room.id)

      WsClient.assert_frame("new_user_join_room", _)

      assert %{} = Onion.RoomSession.get(room.id, :activeSpeakerMap)

      WsClient.send_msg_legacy(
        t.client_ws,
        "speaking_change",
        %{"value" => true}
      )

      # both websockets will be informed
      WsClient.assert_frame(
        "active_speaker_change",
        %{"activeSpeakerMap" => map},
        t.client_ws
      )

      assert is_map_key(map, t.user.id)

      WsClient.assert_frame(
        "active_speaker_change",
        %{"activeSpeakerMap" => map},
        other_ws
      )

      assert is_map_key(map, t.user.id)

      map = Onion.RoomSession.get(room.id, :activeSpeakerMap)

      assert is_map_key(map, t.user.id)

      Process.sleep(100)

      WsClient.send_msg_legacy(
        t.client_ws,
        "speaking_change",
        %{"value" => false}
      )

      WsClient.assert_frame(
        "active_speaker_change",
        %{"activeSpeakerMap" => map},
        t.client_ws
      )

      refute is_map_key(map, t.user.id)

      WsClient.assert_frame(
        "active_speaker_change",
        %{"activeSpeakerMap" => map},
        other_ws
      )

      refute is_map_key(map, t.user.id)

      map = Onion.RoomSession.get(room.id, :activeSpeakerMap)

      refute is_map_key(map, t.user.id)
    end

    test "does nothing if it's unset", t do
      user_id = t.user.id

      {:ok, %{room: room}} = Kousa.Room.create_room(user_id, "foo room", "foobar", false)

      # add a second user to the test
      other = %{id: other_id} = Factory.create(User)
      _other_ws = WsClientFactory.create_client_for(other)
      Kousa.Room.join_room(other_id, room.id)

      WsClient.assert_frame("new_user_join_room", _)

      Onion.RoomSession.get(room.id, :activeSpeakerMap)

      WsClient.send_msg_legacy(
        t.client_ws,
        "speaking_change",
        %{"value" => false}
      )

      WsClient.assert_frame(
        "active_speaker_change",
        %{"activeSpeakerMap" => map}
      )

      assert map == %{}

      map = Onion.RoomSession.get(room.id, :activeSpeakerMap)

      assert map == %{}
    end
  end
end

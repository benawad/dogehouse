defmodule BrothTest.SetListenerTest do
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

  describe "the websocket set_listener operation" do
    test "takes a speaker and turns them into listener", t do
      %{"id" => room_id} =
        WsClient.do_call(
          t.client_ws,
          "room:create",
          %{"name" => "foo room", "description" => "foo"}
        )

      # make sure the user is in there.
      assert %{currentRoomId: ^room_id} = Users.get_by_id(t.user.id)

      # create a speaker user that is logged in.
      speaker = %{id: speaker_id} = Factory.create(User)
      speaker_ws = WsClientFactory.create_client_for(speaker)

      # join the speaker user into the room
      WsClient.do_call(speaker_ws, "room:join", %{"roomId" => room_id})
      WsClient.assert_frame_legacy("new_user_join_room", _)

      Beef.RoomPermissions.set_speaker(t.user.id, room_id, true)

      assert Beef.RoomPermissions.speaker?(t.user.id, room_id)

      WsClient.send_msg_legacy(t.client_ws, "set_listener", %{"userId" => speaker_id})

      WsClient.assert_frame_legacy(
        "speaker_removed",
        %{"roomId" => ^room_id, "userId" => ^speaker_id},
        t.client_ws
      )

      WsClient.assert_frame_legacy(
        "speaker_removed",
        %{"roomId" => ^room_id, "userId" => ^speaker_id},
        speaker_ws
      )

      refute Beef.RoomPermissions.speaker?(speaker_id, room_id)
    end
  end

  test "mods can't move other mods to listeners", t do
    %{"id" => room_id} =
      WsClient.do_call(
        t.client_ws,
        "room:create",
        %{"name" => "foo room", "description" => "foo"}
      )

    # make sure the user is in there.
    assert %{currentRoomId: ^room_id} = Users.get_by_id(t.user.id)

    # create a user that is logged in and will be moded.
    mod1 = %{id: mod1_id} = Factory.create(User)
    mod1_ws = WsClientFactory.create_client_for(mod1)

    # create another user that is logged in and will be moded.
    mod2 = %{id: mod2_id} = Factory.create(User)
    mod2_ws = WsClientFactory.create_client_for(mod2)

    # join the mod1 user into the room
    WsClient.do_call(mod1_ws, "room:join", %{"roomId" => room_id})
    WsClient.assert_frame_legacy("new_user_join_room", _)

    # join the mod2 user into the room
    WsClient.do_call(mod2_ws, "room:join", %{"roomId" => room_id})
    WsClient.assert_frame_legacy("new_user_join_room", _)

    # make mod1 user a mod
    Beef.RoomPermissions.set_is_mod(mod1_id, room_id, true)
    assert Beef.RoomPermissions.mod?(mod1_id, room_id)

    # make mod2 user a mod
    Beef.RoomPermissions.set_is_mod(mod2_id, room_id, true)
    assert Beef.RoomPermissions.mod?(mod2_id, room_id)

    # set mod2 as speaker
    Beef.RoomPermissions.set_speaker(mod2_id, room_id, true)
    assert Beef.RoomPermissions.speaker?(mod2_id, room_id)

    # set mod2 as listener using mod1
    WsClient.send_msg_legacy(mod1_ws, "set_listener", %{"userId" => mod2_id})

    #mod1 can't move mod2 to listeners
    refute Beef.RoomPermissions.listener?(mod2_id, room_id)
  end
end

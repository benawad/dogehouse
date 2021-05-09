defmodule BrothTest.Room.SetRoleTest do
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

    %{"id" => room_id} =
      WsClient.do_call(
        client_ws,
        "room:create",
        %{"name" => "foo room", "description" => "foo"}
      )

    {:ok, user: user, client_ws: client_ws, room_id: room_id}
  end

  describe "for when you room:set_role to listener" do
    test "takes a speaker and turns them into lister", t do
      room_id = t.room_id

      # create a speaker user that is logged in.
      speaker = %{id: speaker_id} = Factory.create(User)
      speaker_ws = WsClientFactory.create_client_for(speaker)

      # join the speaker user into the room
      WsClient.do_call(speaker_ws, "room:join", %{"roomId" => room_id})
      WsClient.assert_frame_legacy("new_user_join_room", _)

      Beef.RoomPermissions.set_speaker(t.user.id, room_id, true)

      assert Beef.RoomPermissions.speaker?(t.user.id, room_id)

      WsClient.send_msg(t.client_ws, "room:set_role", %{
        "userId" => speaker_id,
        "role" => "listener"
      })

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

    test "mods can't move other mods to listeners", t do
      room_id = t.room_id

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
      WsClient.send_msg(mod1_ws, "room:set_role", %{
        "userId" => mod2_id,
        "role" => "listener"
      })
  
      #mod1 can't move mod2 to listeners
      refute Beef.RoomPermissions.listener?(mod2_id, room_id)
    end

    @tag :skip
    test "you can make yourself a listener"

    @tag :skip
    test "you can't make someone a listener unless you're a mod"
  end

  describe "when you set_role to speaker" do
    test "makes the person a speaker", t do
      room_id = t.room_id

      # create a user that is logged in.
      speaker = %{id: speaker_id} = Factory.create(User)
      speaker_ws = WsClientFactory.create_client_for(speaker)

      # join the speaker user into the room
      WsClient.do_call(speaker_ws, "room:join", %{"roomId" => room_id})

      refute Beef.RoomPermissions.speaker?(speaker_id, room_id)
      Kousa.Room.set_role(speaker_id, :raised_hand, by: t.user.id)
      assert Beef.RoomPermissions.asked_to_speak?(speaker_id, room_id)

      WsClient.assert_frame_legacy("new_user_join_room", %{"user" => %{"id" => ^speaker_id}})

      # add the person as a speaker.
      WsClient.send_msg(
        t.client_ws,
        "room:set_role",
        %{"userId" => speaker_id, "role" => "speaker"}
      )

      # both clients get notified
      WsClient.assert_frame_legacy(
        "speaker_added",
        %{"userId" => ^speaker_id, "roomId" => ^room_id},
        t.client_ws
      )

      WsClient.assert_frame_legacy(
        "speaker_added",
        %{"userId" => ^speaker_id, "roomId" => ^room_id},
        speaker_ws
      )

      assert Beef.RoomPermissions.speaker?(speaker_id, room_id)
    end

    test "ask to speak makes you a speaker when auto speaker is on", t do
      %{"id" => room_id} =
        WsClient.do_call(
          t.client_ws,
          "room:create",
          %{"name" => "foo room", "description" => "foo", "autoSpeaker" => true}
        )

      # create a user that is logged in.
      speaker = %{id: speaker_id} = Factory.create(User)
      speaker_ws = WsClientFactory.create_client_for(speaker)

      # join the speaker user into the room
      WsClient.do_call(speaker_ws, "room:join", %{"roomId" => room_id})

      refute Beef.RoomPermissions.speaker?(speaker_id, room_id)
      Kousa.Room.set_role(speaker_id, :raised_hand, by: t.user.id)

      # both clients get notified
      WsClient.assert_frame_legacy(
        "speaker_added",
        %{"userId" => ^speaker_id, "roomId" => ^room_id},
        t.client_ws
      )

      WsClient.assert_frame_legacy(
        "speaker_added",
        %{"userId" => ^speaker_id, "roomId" => ^room_id},
        speaker_ws
      )

      assert Beef.RoomPermissions.speaker?(speaker_id, room_id)
    end

    test "can only make them a speaker if they asked to speak", t do
      # first, create a room owned by the primary user.
      {:ok, %{room: %{id: room_id}}} = Kousa.Room.create_room(t.user.id, "foo room", "foo", false)
      # make sure the user is in there.
      assert %{currentRoomId: ^room_id} = Users.get_by_id(t.user.id)

      # create a user that is logged in.
      speaker = %{id: speaker_id} = Factory.create(User)

      refute Beef.RoomPermissions.speaker?(speaker.id, room_id)

      # join the speaker user into the room
      Kousa.Room.join_room(speaker_id, room_id)

      WsClient.assert_frame_legacy("new_user_join_room", %{"user" => %{"id" => ^speaker_id}})

      # add the person as a speaker.
      WsClient.send_msg(
        t.client_ws,
        "room:set_role",
        %{"userId" => speaker_id, "role" => "speaker"}
      )

      refute Beef.RoomPermissions.speaker?(speaker_id, room_id)
    end

    test "mod can make the person a speaker", t do
      room_id = t.room_id

      # create a user that is logged in.
      speaker = %{id: speaker_id} = Factory.create(User)
      speaker_ws = WsClientFactory.create_client_for(speaker)

      # join the speaker user into the room
      Kousa.Room.join_room(speaker_id, room_id)
      Kousa.Room.set_role(speaker_id, :raised_hand, by: t.user.id)

      WsClient.assert_frame_legacy("new_user_join_room", %{"user" => %{"id" => ^speaker_id}})

      # create mod
      mod = %{id: mod_id} = Factory.create(User)
      mod_ws = WsClientFactory.create_client_for(mod)

      Kousa.Room.join_room(mod_id, room_id)

      WsClient.assert_frame_legacy("new_user_join_room", %{"user" => %{"id" => ^mod_id}})

      Kousa.Room.set_auth(mod_id, :mod, by: t.user.id)

      # add the person as a speaker.
      WsClient.send_msg(
        mod_ws,
        "room:set_role",
        %{"userId" => speaker_id, "role" => "speaker"}
      )

      # both clients get notified
      WsClient.assert_frame_legacy(
        "speaker_added",
        %{"userId" => ^speaker_id, "roomId" => ^room_id},
        mod_ws
      )

      WsClient.assert_frame_legacy(
        "speaker_added",
        %{"userId" => ^speaker_id, "roomId" => ^room_id},
        speaker_ws
      )

      assert Beef.RoomPermissions.speaker?(speaker_id, room_id)
    end

    @tag :skip
    test "you can't make a person a speaker if you aren't a mod"
  end
end

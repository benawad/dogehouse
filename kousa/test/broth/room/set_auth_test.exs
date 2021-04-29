defmodule BrothTest.Room.SetAuthTest do
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

  describe "the using room:set_auth with mod" do
    test "makes the person a mod", t do
      room_id = t.room_id

      # make sure the user is in there.
      assert %{currentRoomId: ^room_id} = Users.get_by_id(t.user.id)

      # create a user that is logged in.
      speaker = %{id: speaker_id} = Factory.create(User)
      speaker_ws = WsClientFactory.create_client_for(speaker)

      # join the speaker user into the room
      WsClient.do_call(speaker_ws, "room:join", %{"roomId" => room_id})

      WsClient.assert_frame_legacy("new_user_join_room", %{"user" => %{"id" => ^speaker_id}})

      # make the person a mod
      WsClient.send_msg(
        t.client_ws,
        "room:set_auth",
        %{
          "userId" => speaker_id,
          "level" => "mod"
        }
      )

      # both clients get notified
      WsClient.assert_frame_legacy(
        "mod_changed",
        %{"userId" => ^speaker_id, "roomId" => ^room_id},
        t.client_ws
      )

      WsClient.assert_frame_legacy(
        "mod_changed",
        %{"userId" => ^speaker_id, "roomId" => ^room_id},
        speaker_ws
      )

      assert Beef.RoomPermissions.get(speaker_id, room_id).isMod
    end
  end

  describe "the set_auth command can" do
    test "makes the person a room_creator", t do
      room_id = t.room_id

      # make sure the user is in there.
      assert %{currentRoomId: ^room_id} = Users.get_by_id(t.user.id)

      # create a user that is logged in.
      speaker = %{id: speaker_id} = Factory.create(User)
      speaker_ws = WsClientFactory.create_client_for(speaker)

      # join the speaker user into the room
      WsClient.do_call(speaker_ws, "room:join", %{"roomId" => room_id})

      WsClient.assert_frame_legacy("new_user_join_room", %{"user" => %{"id" => ^speaker_id}})

      # make the person a room creator.
      WsClient.send_msg(t.client_ws, "room:set_auth", %{
        "userId" => speaker_id,
        "level" => "owner"
      })

      # NB: we get an extraneous speaker_added message here.
      WsClient.assert_frame_legacy(
        "new_room_creator",
        %{"userId" => ^speaker_id, "roomId" => ^room_id}
      )

      assert Beef.Rooms.get_room_by_id(room_id).creatorId == speaker_id
      assert Process.alive?(t.client_ws)
    end

    @tag :skip
    test "a non-owner can't make someone a room creator"
  end
end

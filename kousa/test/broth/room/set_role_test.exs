defmodule KousaTest.Broth.Room.SetRoleTest do
  use ExUnit.Case, async: true
  use KousaTest.Support.EctoSandbox

  alias Beef.Schemas.User
  alias Beef.Users
  alias Broth.WsClient
  alias BrothTest.WsClientFactory
  alias KousaTest.Support.Factory

  require WsClient

  setup do
    user = Factory.create(User)
    client_ws = WsClientFactory.create_client_for(user)

    {:ok, user: user, client_ws: client_ws}
  end

  describe "for when you set_role to listener" do
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

      WsClient.send_msg(t.client_ws, "room:set_role", %{
        "userId" => speaker_id,
        "role" => "listener"
      })

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

    @tag :skip
    test "you can make yourself a listener"

    @tag :skip
    test "you can't make someone a listener unless you're a mod"
  end

  describe "when you set_role to speaker" do
    test "makes the person a speaker", t do
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

      # add the person as a speaker.
      WsClient.send_msg(
        t.client_ws,
        "room:set_role",
        %{"userId" => speaker_id, "role" => "speaker"}
      )

      # both clients get notified
      WsClient.assert_frame(
        "speaker_added",
        %{"userId" => ^speaker_id, "roomId" => ^room_id},
        t.client_ws
      )

      WsClient.assert_frame(
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

defmodule BrothTest.DeleteRoomChatMessageTest do
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
    client_ws = WsClientFactory.create_client_for(user, legacy: true)

    {:ok, user: user, client_ws: client_ws}
  end

  describe "the websocket delete_room_chat_message operation" do
    test "sends a message to the room", t do
      user_id = t.user.id

      %{"room" => %{"id" => room_id}} =
        WsClient.do_call_legacy(
          t.client_ws,
          "create_room",
          %{"name" => "foo room", "description" => "foo", "privacy" => "public"}
        )

      # make sure the user is in there.
      assert %{currentRoomId: ^room_id} = Users.get_by_id(t.user.id)

      # create a user that is logged in.
      listener = %{id: listener_id} = Factory.create(User)
      listener_ws = WsClientFactory.create_client_for(listener)

      # join the speaker user into the room
      WsClient.do_call_legacy(listener_ws, "join_room_and_get_info", %{"roomId" => room_id})
      WsClient.assert_frame_legacy("new_user_join_room", _)

      # note that an asynchronous delete request doesn't really have
      # to make sense to anyone.

      # TODO: double check that the listener-id can't be hijacked
      # (is it only sent to early-block poor attempts to delete messages?)
      # maybe we should handle this at the frontend level?
      msg_id = UUID.uuid4()

      WsClient.send_msg_legacy(t.client_ws, "delete_room_chat_message", %{
        "messageId" => msg_id,
        "userId" => listener_id
      })

      WsClient.assert_frame_legacy(
        "message_deleted",
        %{
          "deleterId" => ^user_id,
          "messageId" => ^msg_id
        },
        t.client_ws
      )

      WsClient.assert_frame_legacy(
        "message_deleted",
        %{
          "deleterId" => ^user_id,
          "messageId" => ^msg_id
        },
        listener_ws
      )
    end
  end
end

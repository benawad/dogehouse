defmodule BrothTest.SendRoomChatMsgTest do
  use ExUnit.Case, async: true
  use KousaTest.Support.EctoSandbox

  alias Beef.Schemas.User
  alias Beef.Users
  alias BrothTest.WsClient
  alias BrothTest.WsClientFactory
  alias KousaTest.Support.Factory

  require WsClient

  @moduletag :later

  setup do
    user = Factory.create(User)
    client_ws = WsClientFactory.create_client_for(user, legacy: true)

    {:ok, user: user, client_ws: client_ws}
  end

  describe "the websocket send_room_chat operation" do
    @text_token [%{"t" => "text", "v" => "foobar"}]

    test "sends a message to the room", t do
      user_id = t.user.id

      %{"room" => %{"id" => room_id}} =
        WsClient.do_call_legacy(
          t.client_ws,
          "create_room",
          %{"name" => "foo room", "description" => "foo"}
        )

      # make sure the user is in there.
      assert %{currentRoomId: ^room_id} = Users.get_by_id(t.user.id)

      # create a listener user that is logged in.
      listener = Factory.create(User)
      listener_ws = WsClientFactory.create_client_for(listener, legacy: true)

      # join the listener user into the room
      WsClient.do_call_legacy(listener_ws, "join_room_and_get_info", %{"roomId" => room_id})
      WsClient.assert_frame_legacy("new_user_join_room", _)

      WsClient.send_msg_legacy(t.client_ws, "send_room_chat_msg", %{"tokens" => @text_token})

      WsClient.assert_frame_legacy(
        "new_chat_msg",
        %{
          "msg" => %{
            "tokens" => @text_token,
            "id" => _,
            "avatarUrl" => _,
            "displayName" => _,
            "username" => _,
            "userId" => ^user_id,
            "sentAt" => _,
            "isWhisper" => false
          },
          "userId" => ^user_id
        },
        t.client_ws
      )

      WsClient.assert_frame_legacy(
        "new_chat_msg",
        %{
          "msg" => %{
            "tokens" => @text_token,
            "id" => _,
            "avatarUrl" => _,
            "displayName" => _,
            "username" => _,
            "userId" => ^user_id,
            "sentAt" => _,
            "isWhisper" => false
          },
          "userId" => ^user_id
        },
        listener_ws
      )
    end

    @tag :skip
    test "won't send an invalid token over."

    test "can be used to send a whispered message", t do
      %{"room" => %{"id" => room_id}} =
        WsClient.do_call_legacy(
          t.client_ws,
          "create_room",
          %{"name" => "foo room", "description" => "foo"}
        )

      # make sure the user is in there.
      assert %{currentRoomId: ^room_id} = Users.get_by_id(t.user.id)

      # create a user that can hear.
      can_hear = Factory.create(User)
      can_hear_ws = WsClientFactory.create_client_for(can_hear, legacy: true)

      # create a user that can't hear
      cant_hear = Factory.create(User)
      cant_hear_ws = WsClientFactory.create_client_for(cant_hear, legacy: true)

      # join the speaker user into the room
      WsClient.do_call_legacy(can_hear_ws, "join_room_and_get_info", %{"roomId" => room_id})
      WsClient.do_call_legacy(cant_hear_ws, "join_room_and_get_info", %{"roomId" => room_id})
      WsClient.assert_frame_legacy("new_user_join_room", _)
      WsClient.assert_frame_legacy("new_user_join_room", _)

      WsClient.send_msg_legacy(t.client_ws, "send_room_chat_msg", %{
        "tokens" => @text_token,
        "whisperedTo" => [can_hear.id]
      })

      WsClient.assert_frame_legacy(
        "new_chat_msg",
        %{"msg" => %{"tokens" => @text_token, "isWhisper" => true}},
        t.client_ws
      )

      WsClient.assert_frame_legacy(
        "new_chat_msg",
        %{"msg" => %{"tokens" => @text_token, "isWhisper" => true}},
        can_hear_ws
      )

      WsClient.refute_frame(
        "new_chat_msg",
        cant_hear_ws
      )
    end
  end
end

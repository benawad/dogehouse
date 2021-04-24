defmodule BrothTest.SendRoomChatMsgTest do
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

  describe "the websocket send_room_chat operation" do
    @text_token [%{"t" => "text", "v" => "foobar"}]

    test "be sure to test from whom the msg came"

    test "sends a message to the room", t do
      %{"id" => room_id} =
        WsClient.do_call(
          t.client_ws,
          "room:create",
          %{"name" => "foo room", "description" => "foo"})

      # make sure the user is in there.
      assert %{currentRoomId: ^room_id} = Users.get_by_id(t.user.id)

      # create a user that is logged in.
      can_hear = %{id: listener_id} = Factory.create(User)
      listener_ws = WsClientFactory.create_client_for(can_hear)

      # join the speaker user into the room
      WsClient.do_call(listener_ws, "room:join", %{"roomId" => room_id})
      WsClient.assert_frame("new_user_join_room", _)

      WsClient.send_msg_legacy(t.client_ws, "send_room_chat_msg", %{"tokens" => @text_token})

      WsClient.assert_frame(
        "new_chat_msg",
        %{"msg" => %{"tokens" => @text_token}},
        t.client_ws
      )

      WsClient.assert_frame(
        "new_chat_msg",
        %{"msg" => %{"tokens" => @text_token}},
        listener_ws
      )
    end

    @tag :skip
    test "won't send an invalid token over."

    test "can be used to send a whispered message", t do
      %{"id" => room_id} =
        WsClient.do_call(
          t.client_ws,
          "room:create",
          %{"name" => "foo room", "description" => "foo"})
          
      # make sure the user is in there.
      assert %{currentRoomId: ^room_id} = Users.get_by_id(t.user.id)

      # create a user that can hear.
      can_hear = %{id: listener_id} = Factory.create(User)
      can_hear_ws = WsClientFactory.create_client_for(can_hear)

      # create a user that can't hear
      cant_hear = %{id: whispener_id} = Factory.create(User)
      cant_hear_ws = WsClientFactory.create_client_for(cant_hear)

      # join the speaker user into the room
      WsClient.do_call(can_hear_ws, "room:join", %{"roomId" => room_id})
      WsClient.do_call(cant_hear_ws, "room:join", %{"roomId" => room_id})
      WsClient.assert_frame("new_user_join_room", _)
      WsClient.assert_frame("new_user_join_room", _)

      WsClient.send_msg_legacy(t.client_ws, "send_room_chat_msg", %{
        "tokens" => @text_token,
        "whisperedTo" => [can_hear.id]
      })

      WsClient.assert_frame(
        "new_chat_msg",
        %{"msg" => %{"tokens" => @text_token}},
        t.client_ws
      )

      WsClient.assert_frame(
        "new_chat_msg",
        %{"msg" => %{"tokens" => @text_token}},
        cant_hear_ws
      )

      WsClient.refute_frame(
        "new_chat_msg",
        can_hear_ws
      )
    end
  end
end

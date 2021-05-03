defmodule BrothTest.Chat.SendTest do
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

    # first, create a room owned by the primary user.
    %{"id" => room_id} =
      WsClient.do_call(
        client_ws,
        "room:create",
        %{"name" => "foo room", "description" => "foo"}
      )

    {:ok, user: user, client_ws: client_ws, room_id: room_id}
  end

  describe "the websocket chat:send_msg operation" do
    @text_token [%{"t" => "text", "v" => "foobar"}]

    test "sends a message to the room", t do
      user_id = t.user.id
      room_id = t.room_id

      # create a user that is logged in.
      listener = Factory.create(User)
      listener_ws = WsClientFactory.create_client_for(listener)

      WsClient.do_call(listener_ws, "room:join", %{"roomId" => room_id})
      WsClient.assert_frame_legacy("new_user_join_room", _)

      WsClient.send_msg(t.client_ws, "chat:send_msg", %{"tokens" => @text_token})

      WsClient.assert_frame(
        "chat:send",
        %{
          "tokens" => @text_token,
          "sentAt" => _,
          "from" => ^user_id,
          "id" => msg_uuid,
          "isWhisper" => false
        },
        t.client_ws
      )

      WsClient.assert_frame(
        "chat:send",
        %{
          "tokens" => @text_token,
          "sentAt" => _,
          "from" => ^user_id,
          "id" => ^msg_uuid,
          "isWhisper" => false
        },
        listener_ws
      )
    end

    test "can be used to send a whispered message", t do
      user_id = t.user.id
      room_id = t.room_id

      # create a user that won't be able to hear
      cant_hear = Factory.create(User)
      cant_hear_ws = WsClientFactory.create_client_for(cant_hear)

      # create a user that will be able to hear.
      can_hear = Factory.create(User)
      can_hear_ws = WsClientFactory.create_client_for(can_hear)

      # join the two users into the room
      WsClient.do_call(cant_hear_ws, "room:join", %{"roomId" => room_id})
      WsClient.do_call(can_hear_ws, "room:join", %{"roomId" => room_id})

      WsClient.assert_frame_legacy("new_user_join_room", _, t.client_ws)
      WsClient.assert_frame_legacy("new_user_join_room", _, t.client_ws)
      WsClient.assert_frame_legacy("new_user_join_room", _, cant_hear_ws)

      WsClient.send_msg(t.client_ws, "chat:send_msg", %{
        "tokens" => @text_token,
        "whisperedTo" => [can_hear.id]
      })

      WsClient.assert_frame(
        "chat:send",
        %{
          "tokens" => @text_token,
          "from" => ^user_id,
          "sentAt" => _,
          "id" => msg_id,
          "isWhisper" => true
        },
        t.client_ws
      )

      WsClient.assert_frame(
        "chat:send",
        %{
          "tokens" => @text_token,
          "from" => ^user_id,
          "sentAt" => _,
          "id" => ^msg_id,
          "isWhisper" => true
        },
        can_hear_ws
      )

      WsClient.refute_frame("chat:send", cant_hear_ws)
    end
  end

  describe "the sender should not be able to send" do
    test "if they have been chat banned from the room", t do
      room_id = t.room_id

      # create a user that is logged in.
      banned = Factory.create(User)
      banned_ws = WsClientFactory.create_client_for(banned)

      WsClient.do_call(banned_ws, "room:join", %{"roomId" => room_id})
      WsClient.assert_frame_legacy("new_user_join_room", _)

      # ban the new user
      WsClient.send_msg(t.client_ws, "chat:ban", %{"userId" => banned.id})

      WsClient.assert_frame_legacy("chat_user_banned", _)
      WsClient.assert_frame_legacy("chat_user_banned", _)

      WsClient.send_msg(banned_ws, "chat:send_msg", %{"tokens" => @text_token})

      WsClient.refute_frame("chat:send", t.client_ws)
      WsClient.refute_frame("chat:send", banned_ws)
    end

    test "if they have been blocked by the user", t do
      user_id = t.user.id
      room_id = t.room_id

      # create a user that is logged in.
      blocked = Factory.create(User)
      blocked_ws = WsClientFactory.create_client_for(blocked)

      WsClient.do_call(blocked_ws, "room:join", %{"roomId" => room_id})
      WsClient.assert_frame_legacy("new_user_join_room", _)

      # block the new user
      WsClient.do_call(t.client_ws, "user:block", %{"userId" => blocked.id})

      WsClient.send_msg(
        blocked_ws,
        "chat:send_msg",
        %{"tokens" => @text_token, "whisperedTo" => [user_id]}
      )

      WsClient.refute_frame("chat:send", t.client_ws)
      # you will still get the message yourself.
      WsClient.assert_frame("chat:send", _, blocked_ws)

      WsClient.send_msg(
        blocked_ws,
        "chat:send_msg",
        %{"tokens" => @text_token}
      )

      WsClient.refute_frame("chat:send", t.client_ws)
      # you will still get the message yourself.
      WsClient.assert_frame("chat:send", _, blocked_ws)
    end

    test "block, unblock still receives message", t do
      room_id = t.room_id

      # create a user that is logged in.
      blocked = Factory.create(User)
      blocked_ws = WsClientFactory.create_client_for(blocked)

      WsClient.do_call(blocked_ws, "room:join", %{"roomId" => room_id})
      WsClient.assert_frame_legacy("new_user_join_room", _)

      # block the new user
      WsClient.do_call(t.client_ws, "user:block", %{"userId" => blocked.id})
      WsClient.do_call(t.client_ws, "user:unblock", %{"userId" => blocked.id})

      WsClient.send_msg(
        blocked_ws,
        "chat:send_msg",
        %{"tokens" => @text_token}
      )

      blocked_id = blocked.id

      WsClient.assert_frame(
        "chat:send",
        %{
          "tokens" => @text_token,
          "sentAt" => _,
          "from" => ^blocked_id,
          "id" => msg_uuid,
          "isWhisper" => false
        },
        t.client_ws
      )

      WsClient.assert_frame(
        "chat:send",
        %{
          "tokens" => @text_token,
          "sentAt" => _,
          "from" => ^blocked_id,
          "id" => ^msg_uuid,
          "isWhisper" => false
        },
        blocked_ws
      )
    end
  end

  describe "user should not be able to receive message" do
    test "if they have been banned from the room", t do
      room_id = t.room_id
      user_id = t.user.id

      # create a user that is logged in.
      banned = Factory.create(User)
      banned_ws = WsClientFactory.create_client_for(banned)

      WsClient.do_call(banned_ws, "room:join", %{"roomId" => room_id})
      WsClient.assert_frame_legacy("new_user_join_room", _)

      # ban the new user
      WsClient.send_msg(t.client_ws, "room:ban", %{"userId" => banned.id})

      WsClient.assert_frame_legacy("user_left_room", _)

      WsClient.send_msg(t.client_ws, "chat:send_msg", %{"tokens" => @text_token})

      WsClient.assert_frame(
        "chat:send",
        %{
          "tokens" => @text_token,
          "sentAt" => _,
          "from" => ^user_id,
          "isWhisper" => false
        },
        t.client_ws
      )

      WsClient.refute_frame("chat:send", banned_ws)
    end
  end
end

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

    test "if the room chat is disabled by the owner", t do
      user_id = t.user.id
      room_id = t.room_id

      # create a user that will send message
      sender = Factory.create(User)
      sender_ws = WsClientFactory.create_client_for(sender)

      # join the user into room
      WsClient.do_call(sender_ws, "room:join", %{"roomId" => room_id})
      WsClient.assert_frame_legacy("new_user_join_room", _)

      # disable room chat
      WsClient.do_call(t.client_ws, "room:update", %{"chatMode" => "disabled"})

      # send chat msg via sender
      WsClient.send_msg(
        sender_ws,
        "chat:send_msg",
        %{"tokens" => @text_token}
      )

      WsClient.refute_frame("chat:send", t.client_ws)
      WsClient.refute_frame("chat:send", sender_ws)
    end
  end

  describe "user should not be able to receive message" do
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

      # new user to avoid 1 sec throttle

      # create a user that is logged in.
      blocked2 = Factory.create(User)
      blocked2_ws = WsClientFactory.create_client_for(blocked2)

      WsClient.do_call(blocked2_ws, "room:join", %{"roomId" => room_id})
      WsClient.assert_frame_legacy("new_user_join_room", _)

      # block the new user
      WsClient.do_call(t.client_ws, "user:block", %{"userId" => blocked2.id})

      WsClient.send_msg(
        blocked2_ws,
        "chat:send_msg",
        %{"tokens" => @text_token}
      )

      WsClient.refute_frame("chat:send", t.client_ws)
      # you will still get the message yourself.
      WsClient.assert_frame("chat:send", _, blocked2_ws)
    end

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

    test "if whispers are off", t do
      user_id = t.user.id
      room_id = t.room_id

      # create a user that won't be able to hear
      cant_hear = Factory.create(User)
      cant_hear_ws = WsClientFactory.create_client_for(cant_hear)

      WsClient.do_call(cant_hear_ws, "user:update", %{"whisperPrivacySetting" => "off"})

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
        "whisperedTo" => [can_hear.id, cant_hear.id]
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

  describe "when throttled" do
    test "message not sent", t do
      user_id = t.user.id
      room_id = t.room_id


      WsClient.do_call(t.client_ws, "room:update", %{
        "chatThrottle" => 50
      })

      # create a user that is logged in.
      listener = Factory.create(User)
      listener_ws = WsClientFactory.create_client_for(listener)

      WsClient.do_call(listener_ws, "room:join", %{"roomId" => room_id})
      WsClient.assert_frame_legacy("new_user_join_room", _)

      # send the first message
      WsClient.send_msg(t.client_ws, "chat:send_msg", %{"tokens" => @text_token})

      # verify that first message is received
      WsClient.assert_frame(
        "chat:send",
        _,
        t.client_ws
      )
      WsClient.assert_frame(
        "chat:send",
        _,
        listener_ws
      )


      # send second message before the throttle limit is finished, half time of total throttle
      Process.sleep(25)
      WsClient.send_msg(t.client_ws, "chat:send_msg", %{"tokens" => @text_token})
      # this message should be throttled
      WsClient.refute_frame(
        "chat:send",
        t.client_ws
      )
      WsClient.refute_frame(
        "chat:send",
        listener_ws
      )

      # this message should not be throttled
      Process.sleep(51)
      WsClient.send_msg(t.client_ws, "chat:send_msg", %{"tokens" => @text_token})
      WsClient.assert_frame(
        "chat:send",
        _,
        t.client_ws
      )
      WsClient.assert_frame(
        "chat:send",
        _,
        listener_ws
      )

    end
  end

  describe "when follower mode" do
    test "if they are not following they can't send a msg", t do
      room_id = t.room_id
      # create a user that is logged in.
      non_follower = Factory.create(User)
      non_follower_ws = WsClientFactory.create_client_for(non_follower)

      WsClient.do_call(t.client_ws, "room:update", %{
        "chatMode" => "follower_only"
      })

      WsClient.do_call(non_follower_ws, "room:join", %{"roomId" => room_id})
      WsClient.assert_frame_legacy("new_user_join_room", _)

      WsClient.send_msg(non_follower_ws, "chat:send_msg", %{"tokens" => @text_token})

      WsClient.refute_frame("chat:send", t.client_ws)
      WsClient.refute_frame("chat:send", non_follower_ws)
    end

    test "if I become a speaker later I can send msg", t do
      room_id = t.room_id

      speaker = Factory.create(User)
      speaker_ws = WsClientFactory.create_client_for(speaker)
      WsClient.do_call(speaker_ws, "room:join", %{"roomId" => room_id})
      WsClient.assert_frame_legacy("new_user_join_room", _)

      WsClient.do_call(t.client_ws, "room:update", %{
        "chatMode" => "follower_only"
      })

      WsClient.send_msg(speaker_ws, "chat:send_msg", %{"tokens" => @text_token})
      WsClient.refute_frame("chat:send", t.client_ws)

      Kousa.Room.set_role(speaker.id, :raised_hand, by: speaker.id)
      Kousa.Room.set_role(speaker.id, :speaker, by: t.user.id)
      WsClient.send_msg(speaker_ws, "chat:send_msg", %{"tokens" => @text_token})

      speaker_id = speaker.id

      WsClient.assert_frame(
        "chat:send",
        %{
          "tokens" => @text_token,
          "sentAt" => _,
          "from" => ^speaker_id,
          "id" => msg_uuid,
          "isWhisper" => false
        },
        t.client_ws
      )
    end

    test "if I become a mod later I can send msg", t do
      room_id = t.room_id

      mod = Factory.create(User)
      mod_ws = WsClientFactory.create_client_for(mod)
      WsClient.do_call(mod_ws, "room:join", %{"roomId" => room_id})
      WsClient.assert_frame_legacy("new_user_join_room", _)

      WsClient.do_call(t.client_ws, "room:update", %{
        "chatMode" => "follower_only"
      })

      WsClient.send_msg(mod_ws, "chat:send_msg", %{"tokens" => @text_token})
      WsClient.refute_frame("chat:send", t.client_ws)

      Kousa.Room.set_auth(mod.id, :mod, by: t.user.id)
      WsClient.send_msg(mod_ws, "chat:send_msg", %{"tokens" => @text_token})

      mod_id = mod.id

      WsClient.assert_frame(
        "chat:send",
        %{
          "tokens" => @text_token,
          "sentAt" => _,
          "from" => ^mod_id,
          "id" => msg_uuid,
          "isWhisper" => false
        },
        t.client_ws
      )
    end

    test "if I am a follower, mod, speaker, or creator I can send msg", t do
      room_id = t.room_id
      # create a user that is logged in.
      follower = Factory.create(User)
      follower_ws = WsClientFactory.create_client_for(follower)

      WsClient.do_call(follower_ws, "user:follow", %{
        "userId" => t.user.id
      })

      WsClient.do_call(follower_ws, "room:join", %{"roomId" => room_id})
      WsClient.assert_frame_legacy("new_user_join_room", _)

      mod = Factory.create(User)
      mod_ws = WsClientFactory.create_client_for(mod)
      WsClient.do_call(mod_ws, "room:join", %{"roomId" => room_id})
      Kousa.Room.set_auth(mod.id, :mod, by: t.user.id)
      WsClient.assert_frame_legacy("new_user_join_room", _)

      speaker = Factory.create(User)
      speaker_ws = WsClientFactory.create_client_for(speaker)
      WsClient.do_call(speaker_ws, "room:join", %{"roomId" => room_id})

      Kousa.Room.set_role(speaker.id, :raised_hand, by: speaker.id)
      Kousa.Room.set_role(speaker.id, :speaker, by: t.user.id)

      WsClient.assert_frame_legacy("new_user_join_room", _)

      WsClient.do_call(t.client_ws, "room:update", %{
        "chatMode" => "follower_only"
      })

      follower_id = follower.id

      Enum.each(
        [
          {"follower", follower.id, follower_ws},
          {"mod", mod.id, mod_ws},
          {"speaker", speaker.id, speaker_ws},
          {"room creator", t.user.id, t.client_ws}
        ],
        fn {label, id, ws} ->
          WsClient.send_msg(ws, "chat:send_msg", %{"tokens" => @text_token})

          WsClient.assert_frame(
            "chat:send",
            %{
              "tokens" => @text_token,
              "sentAt" => _,
              "from" => ^id,
              "id" => msg_uuid,
              "isWhisper" => false
            },
            t.client_ws
          )
        end
      )
    end
  end
end

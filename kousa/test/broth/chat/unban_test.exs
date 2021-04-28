defmodule BrothTest.Chat.UnbanTest do
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

  describe "the websocket chat:ban operation" do
    test "bans the person from the room chat", t do
      %{"id" => room_id} =
        WsClient.do_call(
          t.client_ws,
          "room:create",
          %{"name" => "foo room", "description" => "foo"}
        )

      # make sure the user is in there.
      assert %{currentRoomId: ^room_id} = Users.get_by_id(t.user.id)

      # create a user that is logged in.
      banned = %{id: banned_id} = Factory.create(User)
      banned_ws = WsClientFactory.create_client_for(banned)

      # join the speaker user into the room
      WsClient.do_call(banned_ws, "room:join", %{"roomId" => room_id})
      WsClient.assert_frame_legacy("new_user_join_room", _)

      WsClient.send_msg(t.client_ws, "chat:ban", %{"userId" => banned_id})
      WsClient.assert_frame_legacy("chat_user_banned", %{"userId" => ^banned_id}, t.client_ws)

      assert Onion.Chat.banned?(room_id, banned_id)

      WsClient.send_msg(t.client_ws, "chat:unban", %{"userId" => banned_id})
      WsClient.assert_frame_legacy("chat_user_unbanned", %{"userId" => ^banned_id}, t.client_ws)

      refute Onion.Chat.banned?(room_id, banned_id)
    end

    @tag :skip
    test "a non-mod can't ban someone from room chat"
  end
end

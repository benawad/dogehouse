defmodule BrothTest.UnbanFromRoomTest do
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

  describe "the websocket unban_from_room operation" do
    test "unbans a person", t do
      %{"id" => room_id} =
        WsClient.do_call(
          t.client_ws,
          "room:create",
          %{"name" => "foo room", "description" => "foo"}
        )

      # make sure the user is in there.
      assert %{currentRoomId: ^room_id} = Users.get_by_id(t.user.id)

      # create a blocked user that is logged in.
      %{id: blocked_id} = Factory.create(User)

      Beef.RoomBlocks.insert(%{
        userId: blocked_id,
        roomId: room_id,
        modId: t.user.id
      })

      assert Beef.RoomBlocks.blocked?(room_id, blocked_id)

      # block the person.
      ref =
        WsClient.send_call_legacy(
          t.client_ws,
          "unban_from_room",
          %{"userId" => blocked_id}
        )

      WsClient.assert_reply_legacy(ref, %{})

      refute Beef.RoomBlocks.blocked?(room_id, blocked_id)
    end
  end
end

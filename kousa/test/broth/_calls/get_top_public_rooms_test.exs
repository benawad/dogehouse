defmodule BrothTest.GetTopPublicRoomsTest do
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

  describe "the websocket get_top_public_rooms operation" do
    test "returns one public room if it's the only one", t do
      user_id = t.user.id

      %{"id" => room_id} =
        WsClient.do_call(
          t.client_ws,
          "room:create",
          %{"name" => "foo room", "description" => "foo"}
        )

      # make sure the user is in there.
      assert %{currentRoomId: ^room_id} = Users.get_by_id(user_id)

      ref =
        WsClient.send_call_legacy(
          t.client_ws,
          "get_top_public_rooms",
          %{}
        )

      WsClient.assert_reply_legacy(
        ref,
        %{"rooms" => [%{"id" => ^room_id}]},
        t.client_ws
      )
    end

    test "doesn't return a room if it's private", t do
      user_id = t.user.id

      %{"id" => room_id} =
        WsClient.do_call(
          t.client_ws,
          "room:create",
          %{"name" => "foo room", "description" => "foo", "isPrivate" => true}
        )

      # make sure the user is in there.
      assert %{currentRoomId: ^room_id} = Users.get_by_id(user_id)

      ref =
        WsClient.send_call_legacy(
          t.client_ws,
          "get_top_public_rooms",
          %{}
        )

      WsClient.assert_reply_legacy(
        ref,
        %{"rooms" => []},
        t.client_ws
      )
    end

    @tag :skip
    test "when there's more than one room"

    @tag :skip
    test "cursors also work"

    @tag :skip
    test "there is a maximum limit to the cursor"
  end
end

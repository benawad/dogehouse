defmodule BrothTest.Misc.Search do
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

  describe "the websocket misc:search operation" do
    test "returns public room if query matches", t do
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
        WsClient.send_call(
          t.client_ws,
          "misc:search",
          %{query: "foo"}
        )

      WsClient.assert_reply(
        "misc:search:reply",
        ref,
        %{"items" => [%{"id" => ^room_id}]},
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
        WsClient.send_call(
          t.client_ws,
          "misc:search",
          %{query: "foo"}
        )

      WsClient.assert_reply(
        "misc:search:reply",
        ref,
        %{"items" => []},
        t.client_ws
      )
    end

    test "returns user if query matches", t do
      ref =
        WsClient.send_call(
          t.client_ws,
          "misc:search",
          %{query: "@" <> t.user.username}
        )

      u_id = t.user.id

      WsClient.assert_reply(
        "misc:search:reply",
        ref,
        %{"items" => [%{"id" => ^u_id}]},
        t.client_ws
      )
    end
  end
end

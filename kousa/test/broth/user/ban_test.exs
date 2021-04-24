defmodule BrothTest.User.BanTest do
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

  describe "the websocket user:ban operation" do
    test "doesn't work for not-ben awad", t do
      banned = Factory.create(User)
      WsClientFactory.create_client_for(banned)

      ref =
        WsClient.send_call(t.client_ws, "user:ban", %{
          "userId" => banned.id,
          "reason" => "you're a douche"
        })

      WsClient.assert_error("user:ban", ref, %{"message" => message})
      assert message =~ "but that user didn't exist"
    end

    @ben_github_id Application.compile_env!(:kousa, :ben_github_id)

    test "works for ben awad", t do
      t.user
      |> User.changeset(%{githubId: @ben_github_id})
      |> Beef.Repo.update!()

      banned = Factory.create(User)
      banned_ws = WsClientFactory.create_client_for(banned)

      ref =
        WsClient.send_call(t.client_ws, "user:ban", %{
          "userId" => banned.id,
          "reason" => "you're a douche"
        })

      WsClient.assert_reply("user:ban:reply", ref, reply)
      refute is_map_key(reply, "error")

      # this frame is targetted to the banned user
      WsClient.assert_frame_legacy("banned", _, banned_ws)

      # check that the user has been updated.
      assert %{reasonForBan: "you're a douche"} = Users.get_by_id(banned.id)
    end

    test "will destroy a room if they are alone", t do
      t.user
      |> User.changeset(%{githubId: @ben_github_id})
      |> Beef.Repo.update!()

      banned = Factory.create(User)
      banned_ws = WsClientFactory.create_client_for(banned)

      %{"id" => room_id} =
        WsClient.do_call(
          banned_ws,
          "room:create",
          %{"name" => "foo room", "description" => "foo"}
        )

      WsClient.do_call(t.client_ws, "user:ban", %{
        "userId" => banned.id,
        "reason" => "you're a douche"
      })

      # note: targeted to banned_ws
      WsClient.assert_frame_legacy("banned", _, banned_ws)

      # check that the room is gone.
      refute Beef.Rooms.get_room_by_id(room_id)
    end

    test "will eject a user from a room if they aren't alone", t do
      t.user
      |> User.changeset(%{githubId: @ben_github_id})
      |> Beef.Repo.update!()

      banned = Factory.create(User)
      banned_ws = WsClientFactory.create_client_for(banned)

      safe = %{id: safe_id} = Factory.create(User)
      safe_ws = WsClientFactory.create_client_for(safe)

      %{"id" => room_id} =
        WsClient.do_call(
          safe_ws,
          "room:create",
          %{"name" => "foo room", "description" => "foo"}
        )

      # join the banned user to the room
      WsClient.do_call(banned_ws, "room:join", %{"roomId" => room_id})

      assert %{peoplePreviewList: [_, _]} = Beef.Rooms.get_room_by_id(room_id)

      WsClient.send_call(t.client_ws, "user:ban", %{
        "userId" => banned.id,
        "reason" => "you're a douche"
      })

      WsClient.assert_frame_legacy("banned", _, banned_ws)

      # check that the room is still there and the safe user is there
      assert %{
               peoplePreviewList: [%{id: ^safe_id}]
             } = Beef.Rooms.get_room_by_id(room_id)
    end
  end
end

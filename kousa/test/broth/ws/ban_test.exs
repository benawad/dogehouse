defmodule KousaTest.Broth.Ws.BanTest do
  use ExUnit.Case, async: true
  use Kousa.Support.EctoSandbox

  alias Beef.Schemas.User
  alias Beef.Users
  alias Broth.WsClient
  alias Broth.WsClientFactory
  alias Kousa.Support.Factory

  require WsClient

  setup do
    user = Factory.create(User)
    ws_client = WsClientFactory.create_client_for(user)

    {:ok, user: user, ws_client: ws_client}
  end

  describe "the websocket ban operation" do
    test "doesn't work for not-ben awad", t do
      banned = Factory.create(User)
      WsClientFactory.create_client_for(banned)

      WsClient.send_msg(t.ws_client, "ban",
        %{"username" => banned.username, "reason" => "you're a douche"})

      WsClient.assert_frame("ban_done", %{"worked" => false})
    end

    @ben_github_id Application.compile_env!(:kousa, :ben_github_id)

    test "works for not-ben awad", t do
      t.user
      |> User.changeset(%{githubId: @ben_github_id})
      |> Beef.Repo.update!

      banned = Factory.create(User)
      WsClientFactory.create_client_for(banned)

      WsClient.send_msg(t.ws_client, "ban",
        %{"username" => banned.username, "reason" => "you're a douche"})

      WsClient.assert_frame("ban_done", %{"worked" => true})

      # this frame is tragetted to the banned user
      WsClient.assert_frame("banned", _)

      # check that the user has been updated.
      assert %{reasonForBan: "you're a douche"} = Users.get_by_id(banned.id)
    end

    test "will destroy a room if they are alone", t do
      t.user
      |> User.changeset(%{githubId: @ben_github_id})
      |> Beef.Repo.update!

      banned = %{id: banned_id} = Factory.create(User)
      WsClientFactory.create_client_for(banned)

      {:ok, %{room: room}} = Kousa.Room.create_room(
        banned_id,
        "my private room",
        "stay out",
        true)

      assert %{peoplePreviewList: [%{id: ^banned_id}]} = room

      WsClient.send_msg(t.ws_client, "ban",
      %{"username" => banned.username, "reason" => "you're a douche"})

      WsClient.assert_frame("banned", _)

      # check that the room is gone.
      refute Beef.Rooms.get_room_by_id(room.id)
    end

    test "will eject a user from a room if they aren't alone", t do
      t.user
      |> User.changeset(%{githubId: @ben_github_id})
      |> Beef.Repo.update!

      banned = %{id: banned_id} = Factory.create(User)
      WsClientFactory.create_client_for(banned)

      safe = %{id: safe_id} = Factory.create(User)
      WsClientFactory.create_client_for(safe)

      {:ok, %{room: room}} = Kousa.Room.create_room(
        safe_id,
        "my private room",
        "stay out",
        false)

      # join the safe user to the room
      Kousa.Room.join_room(banned_id, room.id)

      assert %{peoplePreviewList: [_, _]} = Beef.Rooms.get_room_by_id(room.id)

      WsClient.send_msg(t.ws_client, "ban",
      %{"username" => banned.username, "reason" => "you're a douche"})

      WsClient.assert_frame("banned", _)

      # check that the room is still there
      assert %{
        peoplePreviewList: [%{id: ^safe_id}]
      } = Beef.Rooms.get_room_by_id(room.id) 
    end
  end
end

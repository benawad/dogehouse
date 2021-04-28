defmodule Kousa.Beef.UsersTest do
  # what a terrible module name!
  # TODO: organize this into the correct context.

  use ExUnit.Case, async: true
  use KousaTest.Support.EctoSandbox

  alias Beef.Schemas.Room
  alias Beef.Schemas.User
  alias Beef.Users
  alias KousaTest.Support.Factory
  alias Beef.Repo

  describe "Users" do
    setup do
      {:ok, user: Factory.create(User)}
    end

    test "edit_profile", %{user: user} do
      # TODO: probably you want this to take a user
      # struct as the first parameter.
      refute user.bio == "updated bio"

      {:ok, %User{id: id}} =
        Users.edit_profile(user.id, %{
          bio: "updated bio",
          username: "dave",
          displayName: "bar",
          avatarUrl: "https://www.pbs.twimg.com/profile_images/ghi.jpg",
          bannerUrl:
            "https://pbs.twimg.com/profile_banners/840626569743912960/1601562221/1500x500"
        })

      assert %{
               id: ^id,
               bio: "updated bio",
               username: "dave",
               displayName: "bar",
               avatarUrl: "https://www.pbs.twimg.com/profile_images/ghi.jpg",
               bannerUrl:
                 "https://pbs.twimg.com/profile_banners/840626569743912960/1601562221/1500x500"
             } = Repo.get!(User, user.id)
    end

    test "search", %{user: user} do
      # TODO: make offset default to zero
      assert {[%User{}], _} = Users.search(user.username, 0)

      assert {[%User{}], _} = Users.search(user.displayName, 0)

      assert {[], _} = Users.search("foobarbaz", 0)

      # TODO: more tests on stuff like how search
      # interacts with rooms.  This needs to be specced
      # out by Ben.
    end

    test "bulk_insert" do
      Users.bulk_insert([
        %{
          bio: "lorem ipsum",
          username: "david",
          displayName: "d0",
          avatarUrl: "https://foo.bar/d0",
          bannerUrl: "https://foo.bar/d0"
        },
        %{
          bio: "dolor sunt",
          username: "karen",
          displayName: "d1",
          avatarUrl: "https://foo.bar/d1",
          bannerUrl: "https://foo.bar/d1"
        }
      ])

      assert [%User{}, %User{}, %User{}] = Repo.all(User)
    end

    test "find_by_github_ids", %{user: user} do
      Users.bulk_insert([
        %{
          bio: "lorem ipsum",
          username: "david",
          displayName: "d0",
          avatarUrl: "https://foo.bar/d0",
          bannerUrl: "https://foo.bar/d0",
          githubId: "abcdef"
        },
        %{
          bio: "dolor sunt",
          username: "karen",
          displayName: "d1",
          avatarUrl: "https://foo.bar/d1",
          bannerUrl: "https://foo.bar/d1",
          githubId: "ghijkl"
        }
      ])

      # note that there is one entry in there already.
      assert [_, _, _] = Repo.all(User)

      assert [_, _] = Users.find_by_github_ids(["abcdef", "ghijkl"])
      assert [user.id] == Users.find_by_github_ids([user.githubId])
    end

    test "inc_num_following/2", %{user: user} do
      assert %{numFollowing: 0} = Repo.get(User, user.id)

      Users.inc_num_following(user.id, 2)

      assert %{numFollowing: 2} = Repo.get(User, user.id)
    end

    # LOLZ JK this won't work until we have mocked room pools.
    @tag :skip
    test "get_users_in_current_room", %{user: user} do
      # build a room
      %{id: rid} = Factory.create(Room, creatorId: user.id)

      assert {nil, []} = Users.get_users_in_current_room(user.id)

      # attach the user to the room.
      Users.set_current_room(user.id, rid)

      Repo.all(User)

      Users.get_users_in_current_room(user.id)
    end

    test "get_by_id", %{user: %{id: id}} do
      assert %User{id: ^id} = Users.get_by_id(id)
    end

    test "get_by_username", %{user: user} do
      assert user.id == Users.get_by_username(user.username).id
    end

    test "set_reason_for_ban", %{user: user} do
      Users.set_reason_for_ban(user.id, "bad human")

      assert %User{reasonForBan: "bad human"} = Repo.get(User, user.id)
    end

    test "get_by_id_with_current_room", %{user: user} do
      assert %User{currentRoom: nil} = Users.get_by_id_with_current_room(user.id)

      # build a room
      %{id: rid} = Factory.create(Room, creatorId: user.id)

      # attach the user to the room.
      Users.set_current_room(user.id, rid)

      assert %User{currentRoom: %Room{id: ^rid}} = Users.get_by_id_with_current_room(user.id)
    end

    test "set_online", %{user: user} do
      Users.set_online(user.id)

      assert %User{online: true} = Repo.get(User, user.id)
    end

    test "set_user_left_current_room", %{user: user} do
      # build a room
      %{id: rid} = Factory.create(Room, creatorId: user.id)

      # attach the user to the room.
      Users.set_current_room(user.id, rid)

      assert %User{currentRoomId: ^rid} = Repo.get(User, user.id)

      Users.set_user_left_current_room(user.id)

      assert %User{currentRoomId: nil} = Repo.get(User, user.id)
    end

    test "set offline", %{user: user} do
      test_time = DateTime.utc_now()

      Users.set_online(user.id)

      assert %User{
               online: true,
               lastOnline: creation_time
             } = Repo.get(User, user.id)

      # NOTE: old_time was set at account creation.
      assert DateTime.compare(test_time, creation_time) == :gt

      Users.set_offline(user.id)

      assert %User{online: false, lastOnline: last_online_time} = Repo.get(User, user.id)

      # is this really what we want?
      assert creation_time == last_online_time
    end

    test "get_current_room_id returns nil", %{user: %{id: id}} do
      refute Users.get_current_room_id(id)
    end

    @tag :skip
    # doesn't work on account of no mocked room process pool
    test "get_current_room"

    @tag :skip
    # see above.
    test "set_current_room"

    @tag :skip
    test "twitter_find_or_create"

    @tag :skip
    test "github_find_or_create"
  end
end

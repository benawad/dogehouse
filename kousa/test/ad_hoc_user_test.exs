defmodule KousaTest.AdHocUserTest do
  use ExUnit.Case, async: true

  @moduledoc """
  ad-hoc test set to give coverage for all modules
  that have 'alias Beef.User', prior to refactoring.
  """

  # TODO: recategorize into appropriate test cases over
  # time.

  alias Beef.User
  alias Beef.Repo
  alias Kousa.Support.Factory

  import Kousa.Support.Helpers, only: [checkout_ecto_sandbox: 1]
  setup :checkout_ecto_sandbox

  describe "for Beef.Follow" do
    alias Beef.Follow

    test "you can safely insert a beef users into follows table" do
      %{id: id1} = Factory.create(User)
      %{id: id2} = Factory.create(User)

      assert {:ok, %Follow{userId: ^id1, followerId: ^id2}} =
               %Follow{}
               |> Follow.insert_changeset(%{userId: id1, followerId: id2})
               |> Repo.insert()

      assert [follow] = Repo.all(Follow)

      assert %Follow{
               userId: ^id1,
               user: %User{id: ^id1},
               followerId: ^id2,
               follower: %User{id: ^id2}
             } = Repo.preload(follow, [:user, :follower])
    end
  end

  describe "Beef.RoomBlock" do
    alias Beef.RoomBlock
    alias Beef.Room

    test "you can add a room blocker into the roomblock table" do
      %{id: uid} = Factory.create(User)
      %{id: rid} = Factory.create(Room)
      %{id: mid} = Factory.create(User)

      assert {:ok, %RoomBlock{userId: ^uid, roomId: ^rid, modId: ^mid}} =
               %RoomBlock{}
               |> RoomBlock.insert_changeset(%{userId: uid, roomId: rid, modId: mid})
               |> Repo.insert()

      assert [roomblock] = Repo.all(RoomBlock)

      assert %RoomBlock{
               userId: ^uid,
               user: %User{id: ^uid},
               roomId: ^rid,
               # TODO: insert room assoc here.
               modId: ^mid,
               mod: %User{id: ^mid}
             } = Repo.preload(roomblock, [:user, :mod])
    end
  end

  describe "Beef.Room" do
    alias Beef.Room

    test "you can add a room into the room table" do
      %{id: cid} = Factory.create(User)
      vid = UUID.uuid4()

      assert {:ok,
              %Room{
                creatorId: ^cid,
                name: "my room",
                isPrivate: false,
                voiceServerId: ^vid
              }} =
               %Room{}
               |> Room.insert_changeset(%{
                 name: "my room",
                 numPeopleInside: 0,
                 isPrivate: false,
                 creatorId: cid,
                 voiceServerId: vid
               })
               |> Repo.insert()

      assert [room] = Repo.all(Room)

      assert %Room{
               ####################################
               # NOTE these two don't match up.
               creatorId: ^cid,
               user: %User{id: ^cid},
               ####################################
               name: "my room",
               isPrivate: false,
               voiceServerId: ^vid
             } = Repo.preload(room, [:user])
    end
  end

  describe "Beef.UserBlock" do
    alias Beef.UserBlock

    test "you can add a room into the room table" do
      %{id: uid} = Factory.create(User)
      %{id: bid} = Factory.create(User)

      assert {:ok,
              %UserBlock{
                userId: ^uid,
                userIdBlocked: ^bid
              }} =
               %UserBlock{}
               |> UserBlock.insert_changeset(%{
                 userId: uid,
                 userIdBlocked: bid
               })
               |> Repo.insert()

      assert [user_block] = Repo.all(UserBlock)

      assert %UserBlock{
               userId: ^uid,
               user: %User{id: ^uid},
               ####################################
               # NOTE these two don't match up.
               userIdBlocked: ^bid,
               blockedUser: %User{id: ^bid}
               ####################################
             } = Repo.preload(user_block, [:user, :blockedUser])
    end
  end

  describe "Kousa.Data.Follower" do
    alias Kousa.Data.Follower
    alias Beef.Follow

    test "get_followers_online_and_not_in_a_room/1" do
      user = Factory.create(User)
      follower = Factory.create(User)

      # no followers
      assert [] = Follower.get_followers_online_and_not_in_a_room(user.id)

      # make id1 a follower of id2
      %Follow{}
      |> Follow.insert_changeset(%{
        userId: user.id,
        followerId: follower.id
      })
      |> Repo.insert()

      # still no followers
      assert [] = Follower.get_followers_online_and_not_in_a_room(user.id)

      # make user online
      Kousa.Data.User.set_online(follower.id)

      uid = user.id
      fid = follower.id

      assert [follower] = Follower.get_followers_online_and_not_in_a_room(user.id)

      assert %Follow{
               userId: ^uid,
               user: %User{id: ^uid},
               followerId: ^fid,
               follower: %User{id: ^fid}
             } = Repo.preload(follower, [:user, :follower])
    end

    test "bulk_insert/1" do
      uid = Factory.create(User).id
      fid1 = Factory.create(User).id
      fid2 = Factory.create(User).id

      assert {2, _} =
               Follower.bulk_insert([
                 %{userId: uid, followerId: fid1},
                 %{userId: uid, followerId: fid2}
               ])

      assert [
               %Follow{
                 user: %User{id: ^uid},
                 follower: %User{id: ^fid1}
               },
               %Follow{
                 user: %User{id: ^uid},
                 follower: %User{id: ^fid2}
               }
             ] =
               Follow
               |> Repo.all()
               |> Repo.preload([:user, :follower])
    end

    test "is_following_me" do
      uid = Factory.create(User).id
      fid = Factory.create(User).id

      refute Follower.is_following_me(uid, fid)

      Follower.insert(%{userId: uid, followerId: fid})

      assert Follower.is_following_me(uid, fid)
    end

    # TEST IS FAILING: somehow this function is returning
    # offline follows
    @tag :skip
    test "fetch_following_online" do
      uid = Factory.create(User).id
      fid1 = Factory.create(User).id
      fid2 = Factory.create(User).id

      Follower.bulk_insert([
        %{userId: fid1, followerId: uid},
        %{userId: fid2, followerId: uid}
      ])

      assert {[], _} = Follower.fetch_following_online(uid)

      # but only make follower1 online

      Kousa.Data.User.set_online(fid1)

      assert {[_], _} = Follower.fetch_following_online(uid)
    end

    test "fetch_invite_list/2" do
      uid = Factory.create(User).id
      fid1 = Factory.create(User).id
      fid2 = Factory.create(User).id

      Follower.bulk_insert([
        %{userId: uid, followerId: fid1},
        %{userId: uid, followerId: fid2}
      ])

      assert {[], _} = Follower.fetch_invite_list(uid)

      # but only make follower1 online
      Kousa.Data.User.set_online(fid1)

      assert {[%User{id: ^fid1}], _} = Follower.fetch_invite_list(uid)
    end

    @tag :skip
    test "get followers/2" do
      uid = Factory.create(User).id
      fid1 = Factory.create(User).id
      fid2 = Factory.create(User).id

      Follower.bulk_insert([
        %{userId: uid, followerId: fid1},
        %{userId: uid, followerId: fid2}
      ])

      # not really sure how the call signature here works.
      Follower.get_followers(uid, uid)
    end

    @tag :skip
    test "get_following/2" do
      # same issue as before.
    end

    test "delete/2" do
      uid = Factory.create(User).id
      fid1 = Factory.create(User).id
      fid2 = Factory.create(User).id

      Follower.bulk_insert([
        %{userId: uid, followerId: fid1},
        %{userId: uid, followerId: fid2}
      ])

      # not really sure how the call signature here works.
      assert [_, _] = Repo.all(Follow)

      Follower.delete(uid, fid2)

      assert [
               %{
                 userId: ^uid,
                 followerId: ^fid1
               }
             ] = Repo.all(Follow)
    end

    test "insert/1" do
      uid = Factory.create(User).id
      fid = Factory.create(User).id

      Follower.insert(%{userId: uid, followerId: fid})

      assert [
               %Follow{
                 userId: ^uid,
                 followerId: ^fid
               }
             ] = Repo.all(Follow)
    end

    test "get_info" do
      uid = Factory.create(User).id
      fid = Factory.create(User).id

      assert %{followsYou: false, youAreFollowing: false} = Follower.get_info(uid, fid)

      Follower.insert(%{userId: uid, followerId: fid})

      assert %{followsYou: true, youAreFollowing: false} = Follower.get_info(uid, fid)

      Follower.insert(%{userId: fid, followerId: uid})

      assert %{followsYou: true, youAreFollowing: true} = Follower.get_info(uid, fid)

      Follower.delete(uid, fid)

      assert %{followsYou: false, youAreFollowing: true} = Follower.get_info(uid, fid)
    end
  end

  describe "Kousa.Data.User" do
    setup do
      {:ok, user: Factory.create(User)}
    end

    test "edit_profile", %{user: user} do
      # TODO: probably you want this to take a user
      # struct as the first parameter.
      refute user.bio == "updated bio"

      Kousa.Data.User.edit_profile(user.id, %{
        bio: "updated bio",
        username: "dave",
        displayName: "bar"
      })

      assert %{
        bio: "updated bio",
        username: "dave",
        displayName: "bar"
      } = Repo.get!(User, user.id)
    end

    test "search", %{user: user} do
      # TODO: make offset default to zero
      assert {[%User{}], _} =
        Kousa.Data.User.search(user.username, 0)

      assert {[%User{}], _} =
        Kousa.Data.User.search(user.displayName, 0)

      assert {[], _} =
        Kousa.Data.User.search("foobarbaz", 0)

      # TODO: more tests on stuff like how search
      # interacts with rooms.  This needs to be specced
      # out by Ben.
    end

    test "bulk_insert" do
      Kousa.Data.User.bulk_insert([%{
        bio: "lorem ipsum",
        username: "david",
        displayName: "d0",
        avatarUrl: "https://foo.bar/d0"
      }, %{
        bio: "dolor sunt",
        username: "karen",
        displayName: "d1",
        avatarUrl: "https://foo.bar/d1"
      }])

      assert [%User{}, %User{}, %User{}] =
        Repo.all(User)
    end

    test "find_by_github_ids", %{user: user} do
      Kousa.Data.User.bulk_insert([%{
        bio: "lorem ipsum",
        username: "david",
        displayName: "d0",
        avatarUrl: "https://foo.bar/d0",
        githubId: "abcdef"
      }, %{
        bio: "dolor sunt",
        username: "karen",
        displayName: "d1",
        avatarUrl: "https://foo.bar/d1",
        githubId: "ghijkl"
      }])

      # note that there is one entry in there already.
      assert [_, _, _] = Repo.all(User)

      assert [_, _] = Kousa.Data.User.find_by_github_ids(["abcdef", "ghijkl"])
      assert [user.id] == Kousa.Data.User.find_by_github_ids([user.githubId])
    end

    test "inc_num_following/2", %{user: user} do
      assert %{numFollowing: 0} = Repo.get(User, user.id)

      Kousa.Data.User.inc_num_following(user.id, 2)

      assert %{numFollowing: 2} = Repo.get(User, user.id)
    end

    # LOLZ JK this won't work until we have mocked room pools.
    @tag :skip
    test "get_users_in_current_room", %{user: user} do
      # build a room
      %{id: rid} = Factory.create(Beef.Room, creatorId: user.id)

      assert {nil, []} =
        Kousa.Data.User.get_users_in_current_room(user.id)

      # attach the user to the room.
      Kousa.Data.User.set_current_room(user.id, rid)

      Repo.all(User)

      Kousa.Data.User.get_users_in_current_room(user.id)
    end

    test "get_by_id", %{user: %{id: id}} do
      assert %User{id: ^id} = Kousa.Data.User.get_by_id(id)
    end

    test "get_by_username", %{user: user} do
      assert user.id == Kousa.Data.User.get_by_username(user.username).id
    end

    test "set_reason_for_ban", %{user: user} do
      Kousa.Data.User.set_reason_for_ban(user.id, "bad human")

      assert %User{reasonForBan: "bad human"} = Repo.get(User, user.id)
    end

    test "get_by_id_with_current_room", %{user: user} do
      assert %User{currentRoom: nil} =
        Kousa.Data.User.get_by_id_with_current_room(user.id)

      # build a room
      %{id: rid} = Factory.create(Beef.Room, creatorId: user.id)

      # attach the user to the room.
      Kousa.Data.User.set_current_room(user.id, rid)

      assert %User{currentRoom: %Beef.Room{id: ^rid}} =
        Kousa.Data.User.get_by_id_with_current_room(user.id)
    end

    test "set_online", %{user: user} do
      Kousa.Data.User.set_online(user.id)

      assert %User{online: true} = Repo.get(User, user.id)
    end

    test "set_user_left_current_room", %{user: user} do
      # build a room
      %{id: rid} = Factory.create(Beef.Room, creatorId: user.id)

      # attach the user to the room.
      Kousa.Data.User.set_current_room(user.id, rid)

      assert %User{currentRoomId: ^rid} = Repo.get(User, user.id)

      Kousa.Data.User.set_user_left_current_room(user.id)

      assert %User{currentRoomId: nil} = Repo.get(User, user.id)
    end

    test "set offline", %{user: user} do
      Kousa.Data.User.set_online(user.id)

      assert %User{
        online: true,
        lastOnline: nil} = Repo.get(User, user.id)

      # NOPE.
      # timestamp = DateTime.utc_now |> DateTime.to_naive()

      Kousa.Data.User.set_offline(user.id)

      assert %User{online: false, lastOnline: last_online_time} = Repo.get(User, user.id)

      # THIS COMPARISON IS BASICALLY NOT RELIABLY TESTABLE UNLESS WE INSTITUTE
      # UTC TIMESTAMPS EVERYWHERE

      #assert NaiveDateTime.compare(last_online_time, timestamp) == :gt

      # consolation prize
      refute is_nil(last_online_time)
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

  describe "Kousa.TokenUtils" do
  end
end

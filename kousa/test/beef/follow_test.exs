defmodule Kousa.Beef.FollowTest do
  use ExUnit.Case, async: true
  use KousaTest.Support.EctoSandbox

  @moduledoc """
  ad-hoc test set to give coverage for all modules
  that have 'alias Beef.Schemas.User', prior to refactoring.
  """

  # TODO: recategorize into appropriate test cases over
  # time.

  alias Beef.Schemas.User
  alias Beef.Schemas.Follow
  alias Beef.Follows
  alias Beef.Users

  alias Beef.Repo
  alias KousaTest.Support.Factory

  describe "for Beef.Follow" do
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

    test "search_username orders by numFollowers" do
      Factory.create(User, [{:username, "user1"}, {:numFollowers, 3}])
      Factory.create(User, [{:username, "user2"}, {:numFollowers, 2}])

      assert [%{username: "user1"}, %{username: "user2"}] = Users.search_username("user")

      # creates user with most followers
      Factory.create(User, [{:username, "user3"}, {:numFollowers, 4}])

      assert [%{username: "user3"}, %{username: "user1"}, %{username: "user2"}] =
               Users.search_username("user")
    end
  end

  describe "Follows" do
    test "get_followers_online_and_not_in_a_room/1" do
      user = Factory.create(User)
      follower = Factory.create(User)

      # no followers
      assert [] = Follows.get_followers_online_and_not_in_a_room(user.id)

      # make id1 a follower of id2
      %Follow{}
      |> Follow.insert_changeset(%{
        userId: user.id,
        followerId: follower.id
      })
      |> Repo.insert()

      # still no followers
      assert [] = Follows.get_followers_online_and_not_in_a_room(user.id)

      # make user online
      Users.set_online(follower.id)

      uid = user.id
      fid = follower.id

      assert [follower] = Follows.get_followers_online_and_not_in_a_room(user.id)

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
               Follows.bulk_insert([
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

    test "following_me?" do
      uid = Factory.create(User).id
      fid = Factory.create(User).id

      refute Follows.following_me?(uid, fid)

      Follows.insert(%{userId: uid, followerId: fid})

      assert Follows.following_me?(uid, fid)
    end

    test "fetch_invite_list/2" do
      uid = Factory.create(User).id
      fid1 = Factory.create(User).id
      fid2 = Factory.create(User).id

      Follows.bulk_insert([
        %{userId: uid, followerId: fid1},
        %{userId: uid, followerId: fid2}
      ])

      assert {[], _} = Follows.fetch_invite_list(uid)

      # but only make follower1 online
      Users.set_online(fid1)

      assert {[%User{id: ^fid1}], _} = Follows.fetch_invite_list(uid)
    end

    @tag :skip
    test "get followers/2" do
      uid = Factory.create(User).id
      fid1 = Factory.create(User).id
      fid2 = Factory.create(User).id

      Follows.bulk_insert([
        %{userId: uid, followerId: fid1},
        %{userId: uid, followerId: fid2}
      ])

      # not really sure how the call signature here works.
      Follows.get_followers(uid, uid)
    end

    @tag :skip
    test "get_following/2" do
      # same issue as before.
    end

    test "delete/2" do
      uid = Factory.create(User).id
      fid1 = Factory.create(User).id
      fid2 = Factory.create(User).id

      Follows.bulk_insert([
        %{userId: uid, followerId: fid1},
        %{userId: uid, followerId: fid2}
      ])

      # not really sure how the call signature here works.
      assert [_, _] = Repo.all(Follow)

      Follows.delete(uid, fid2)

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

      Follows.insert(%{userId: uid, followerId: fid})

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

      assert %{followsYou: false, youAreFollowing: false} = Follows.get_info(uid, fid)

      Follows.insert(%{userId: uid, followerId: fid})

      assert %{followsYou: true, youAreFollowing: false} = Follows.get_info(uid, fid)

      Follows.insert(%{userId: fid, followerId: uid})

      assert %{followsYou: true, youAreFollowing: true} = Follows.get_info(uid, fid)

      Follows.delete(uid, fid)

      assert %{followsYou: false, youAreFollowing: true} = Follows.get_info(uid, fid)
    end
  end
end

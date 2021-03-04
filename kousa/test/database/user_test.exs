defmodule Kousa.Database.UserTest do
  # allow tests to run in parallel
  use ExUnit.Case, async: true

  alias Kousa.Support.Factory
  alias Beef.{Repo, User, Room}
  alias Kousa.{Data}

  import Kousa.Support.Helpers, only: [checkout_ecto_sandbox: 1]

  # do this for all async tests.  Eventually move this into a common
  # Kousa.Case module in `support` that you can use.
  setup :checkout_ecto_sandbox

  describe "you can create a user" do
    @gh_input %{
      "id" => 12345,
      "avatar_url" => "https://foo.bar/baz.jpg",
      "name" => "tester",
      "bio" => "test",
      "github_access_token" => "askldjlqwjldq"
    }

    test "with github" do
      {:create, user} = Data.User.github_find_or_create(@gh_input, "foo-access-token")

      [
        ^user
      ] = Repo.all(User)
    end
  end

  defp create_user(_) do
    {:ok, user: Factory.create(User)}
  end

  defp create_two_users(_) do
    {:ok, user1: Factory.create(User), user2: Factory.create(User)}
  end

  describe "when you query a user" do
    setup :create_user

    # @todo figure out how to get ecto to do this:
    # for now I hacked it by returning: true on insert
    # NB: this fails because the databases are currently not configured to
    # autogenerate UUIDs.
    test "by user_id", %{user: user = %{id: id}} do
      assert [^id] = Data.User.find_by_github_ids([user.githubId])
    end
  end

  describe "when you edit a user" do
    setup :create_user

    test "with empty bio", %{user: %{id: id}} do
      assert {:ok, user} =
               Data.User.edit_profile(id, %{
                 username: "timmy",
                 displayName: "tim",
                 bio: "",
                 avatarUrl:
                   "https://pbs.twimg.com/profile_images/1152793238761345024/VRBvxeCM_400x400.jpg"
               })

      assert "" = user.bio
    end
  end

  describe "to mutate a user" do
    setup :create_user

    # see issue, re: test above.
    test "you can use set_online/1 and set_offline/1", %{user: user = %{username: _username}} do
      [id] = Data.User.find_by_github_ids([user.githubId])

      Data.User.set_online(id)

      assert %{online: true} = Data.User.get_by_id(id)

      Data.User.set_offline(id)

      assert %{online: false} = Data.User.get_by_id(id)
    end
  end

  describe "to delete a user" do
    setup :create_two_users

    test "cascades correctly", %{user1: user1, user2: user2} do
      Data.Follower.insert(%{userId: user1.id, followerId: user2.id})
      Factory.create(Room, creatorId: user1.id)
      room = Factory.create(Room, creatorId: user2.id)
      Data.RoomBlock.insert(%{roomId: room.id, userId: user1.id, modId: user2.id})
      Data.UserBlock.insert(%{userIdBlocked: user1.id, userId: user2.id})
      Data.RoomPermission.ask_to_speak(user1.id, room.id)
      assert {:ok, _} = Data.User.delete(user1.id)
    end
  end
end

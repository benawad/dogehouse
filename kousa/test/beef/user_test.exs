defmodule Kousa.Beef.UserTest do
  # allow tests to run in parallel
  use ExUnit.Case, async: true
  use KousaTest.Support.EctoSandbox

  alias KousaTest.Support.Factory
  alias Beef.Follows
  alias Beef.Schemas.Room
  alias Beef.Schemas.User
  alias Beef.UserBlocks
  alias Beef.Users
  alias Beef.Repo

  describe "you can create a user" do
    @gh_input %{
      "id" => 12345,
      "avatar_url" => "https://foo.bar/baz.jpg",
      "banner_url" => "https://foo.bar/baz.jpg",
      "name" => "tester",
      "bio" => "test",
      "github_access_token" => "askldjlqwjldq"
    }

    test "with github" do
      {:create, user} = Users.github_find_or_create(@gh_input, "foo-access-token")

      [
        ^user
      ] = Repo.all(User)
    end
  end

  defp create_user(_) do
    {:ok, user: Factory.create(User)}
  end

  describe "when you query a user" do
    setup :create_user

    # @todo figure out how to get ecto to do this:
    # for now I hacked it by returning: true on insert
    # NB: this fails because the databases are currently not configured to
    # autogenerate UUIDs.
    test "by user_id", %{user: user = %{id: id}} do
      assert [^id] = Users.find_by_github_ids([user.githubId])
    end

    test "by searching username", %{user: %{id: id, username: username}} do
      assert [%{id: ^id}] = Users.search_username("@" <> username)
      assert [%{id: ^id}] = Users.search_username(username)
      assert [%{id: ^id}] = Users.search_username(String.slice(username, 0..2))
      assert [] = Users.search_username("akljdsjoqwdijo12")
    end
  end

  describe "when you edit a user" do
    setup :create_user

    test "it forbids a too short username", %{user: %{id: id}} do
      assert {:error, _} =
               Users.edit_profile(
                 id,
                 %{username: "tim", displayName: "tim", bio: ""}
               )
    end

    test "with avatar_url that is from twitter", %{user: %{id: id}} do
      assert {:ok, user} =
               Users.edit_profile(id, %{
                 username: "timmy",
                 displayName: "tim",
                 bio: "",
                 avatarUrl:
                   "https://pbs.twimg.com/profile_images/1214953675724079106/6Y3XokVC_200x200.jpg"
               })
    end

    test "with avatar_url that is from github", %{user: %{id: id}} do
      assert {:ok, user} =
               Users.edit_profile(id, %{
                 username: "timmy",
                 displayName: "tim",
                 bio: "",
                 avatarUrl: "https://avatars.githubusercontent.com/u/35400192?v=4"
               })
    end

    test "with avatar_url that is from discord", %{user: %{id: id}} do
      assert {:ok, user} =
               Users.edit_profile(id, %{
                 username: "timmy",
                 displayName: "tim",
                 bio: "",
                 avatarUrl:
                   "https://cdn.discordapp.com/avatars/473965680857972757/6b3e4b9be1fd453230172ca6509f0b46.webp"
               })
    end

    test "with avatar_url that is not from twitter/github/discord", %{user: %{id: id}} do
      assert {:error, _} =
               Users.edit_profile(id, %{
                 username: "timmy",
                 displayName: "tim",
                 bio: "",
                 avatarUrl:
                   "https://bit.ly/3dzG9DB#https://avatars.githubusercontent.com/u/44095206?v=4"
               })
    end

    test "with empty bio", %{user: %{id: id}} do
      assert {:ok, user} =
               Users.edit_profile(id, %{
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
      [id] = Users.find_by_github_ids([user.githubId])

      Users.set_online(id)

      assert %{online: true} = Users.get_by_id(id)

      Users.set_offline(id)

      assert %{online: false} = Users.get_by_id(id)
    end
  end

  describe "Users.delete/1" do
    setup :create_user

    test "deletes a user", %{user: user} do
      Users.delete(user.id)
      assert is_nil(Users.get_by_id(user.id))
    end

    test "cascades correctly", %{user: user1} do
      user2 = Factory.create(User)

      Follows.insert(%{userId: user1.id, followerId: user2.id})
      Factory.create(Room, creatorId: user1.id)
      room = Factory.create(Room, creatorId: user2.id)
      Beef.RoomBlocks.insert(%{roomId: room.id, userId: user1.id, modId: user2.id})
      UserBlocks.insert(%{userIdBlocked: user1.id, userId: user2.id})
      Beef.RoomPermissions.ask_to_speak(user1.id, room.id)
      assert {:ok, _} = Users.delete(user1.id)

      # probably needs some more tests here.
    end
  end
end

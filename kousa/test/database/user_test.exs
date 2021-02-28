defmodule Kousa.Database.UserTest do
  # allow tests to run in parallel
  use ExUnit.Case, async: true

  alias Kousa.Support.Factory
  alias Beef.User
  alias Beef.Repo
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
               Data.User.edit_profile(id, %{username: "tim", displayName: "tim", bio: ""})

      assert "" = user.bio
    end
  end

  describe "to mutate a user" do
    setup :create_user

    # see issue, re: test above.
    test "you can use set_online/1 and set_offline/1", %{user: user = %{username: username}} do
      [id] = Data.User.find_by_github_ids([user.githubId])

      Data.User.set_online(id)

      assert %{online: true} = Data.User.get_by_id(id)

      Data.User.set_offline(id)

      assert %{online: false} = Data.User.get_by_id(id)
    end
  end
end

defmodule Kousa.Database.UserTest do
  use ExUnit.Case, async: true  # allow tests to run in parallel

  alias Kousa.Support.Factory
  alias Beef.User
  alias Beef.Repo

  import Kousa.Support.Helpers, only: [checkout_ecto_sandbox: 1]

  # do this for all async tests.  Eventually move this into a common
  # Kousa.Case module in `support` that you can use.
  setup :checkout_ecto_sandbox

  describe "you can create a user" do
    @gh_input %{
      "id" => 12345,
      "avatar_url" => "https://foo.bar/baz.jpg"}

    test "with github" do
      Kousa.Data.User.github_find_or_create(@gh_input, "foo-access-token")

      [%{
        githubId: "12345",
        avatarUrl: "https://foo.bar/baz.jpg"
      }] = Repo.all(User)

      flunk "add more fields into the input"
    end
  end

  defp create_user(_) do
    {:ok, user: Factory.create(User)}
  end

  describe "when you query a user" do
    setup :create_user

    # NB: this fails because the databases are currently not configured to
    # autogenerate UUIDs.
    test "by user_id", %{user: user = %{id: id}} do
      assert [^id] =
        Kousa.Data.User.find_by_github_ids([user.githubId])
    end

    # delete this when the above test works.
    test "by user_id (less good)", %{user: user = %{username: username}} do
      assert [id] =
        Kousa.Data.User.find_by_github_ids([user.githubId])

      assert %User{username: ^username} =
        Kousa.Data.User.get_by_id(id)
    end
  end

  describe "to mutate a user" do
    setup :create_user

    # see issue, re: test above.
    test "you can use set_online/1 and set_offline/1", %{user: user = %{username: username}} do
      [id] = Kousa.Data.User.find_by_github_ids([user.githubId])

      Kousa.Data.User.set_online(id)

      assert %{online: true} = Kousa.Data.User.get_by_id(id)

      Kousa.Data.User.set_offline(id)

      assert %{online: false} = Kousa.Data.User.get_by_id(id)
    end
  end
end

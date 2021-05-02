defmodule KousaTest.User do
  use ExUnit.Case, async: true
  use KousaTest.Support.EctoSandbox

  alias Beef.Schemas.User
  alias KousaTest.Support.Factory
  alias Onion.PubSub

  setup do
    user = Factory.create(User)
    {:ok, user: user}
  end

  describe "update_with/1" do
    test "updates a user with the changeset", %{user: user = %{id: user_id}} do
      PubSub.subscribe("user:update:" <> user_id)

      user
      |> Ecto.Changeset.cast(%{username: "foobar"}, [:username])
      |> Kousa.User.update_with()

      # and propagates new user info to the PubSub notification channel.
      assert_receive {"user:update:" <> ^user_id, %{username: "foobar"}}

      assert %{username: "foobar"} = Beef.Users.get(user_id)
    end
  end
end

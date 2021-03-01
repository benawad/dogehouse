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
        Follow.insert_changeset(
        %Follow{},
        %{userId: id1, followerId: id2}
      )
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
  end

  describe "Beef.Room" do
  end

  describe "Beef.UserBlock" do
  end

  describe "Beef.FollowerData" do
  end

  describe "Kousa.TokenUtils" do
  end
end

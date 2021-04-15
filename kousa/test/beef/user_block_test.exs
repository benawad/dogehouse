defmodule Kousa.Beef.UserBlockTest do
  # allow tests to run in parallel
  use ExUnit.Case, async: true
  use KousaTest.Support.EctoSandbox

  alias KousaTest.Support.Factory
  alias Beef.Schemas.User
  alias Beef.Repo

  describe "Beef.Schemas.UserBlock" do
    alias Beef.Schemas.UserBlock

    test "you can add a user block" do
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
end

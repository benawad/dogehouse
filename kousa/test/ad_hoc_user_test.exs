defmodule KousaTest.AdHocUserTest do
  use ExUnit.Case, async: true
  use Kousa.Support.EctoSandbox

  @moduledoc """
  ad-hoc test set to give coverage for all modules
  that have 'alias Beef.Schemas.User', prior to refactoring.
  """

  # TODO: recategorize into appropriate test cases over
  # time.

  alias Beef.Schemas.User
  alias Beef.Schemas.Room

  alias Beef.Repo
  alias Kousa.Support.Factory

  describe "Beef.Schema.RoomBlock" do
    alias Beef.Schema.RoomBlock

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

  describe "Kousa.TokenUtils" do
  end
end

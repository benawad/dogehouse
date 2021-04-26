defmodule Kousa.Beef.RoomTest do
  # allow tests to run in parallel
  use ExUnit.Case, async: true
  use KousaTest.Support.EctoSandbox

  alias KousaTest.Support.Factory
  alias Beef.Schemas.Room
  alias Beef.Schemas.User
  alias Beef.Repo

  describe "Beef.Room" do
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
end

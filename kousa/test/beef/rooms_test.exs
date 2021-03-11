defmodule Kousa.Beef.RoomsTest do
  # allow tests to run in parallel
  use ExUnit.Case, async: true
  use Kousa.Support.EctoSandbox

  alias Kousa.Support.Factory
  alias Beef.Schemas.User
  alias Beef.Schemas.Room
  alias Beef.Rooms
  alias Beef.Repo

  describe "Rooms" do

    # need to mock user sessions
    # not working atm
    @tag :skip
    test "get_room_status" do
      user = Factory.create(User)
      # if not in room
      assert Rooms.get_room_status(user.id) == {nil, nil}

      # if user is creator of room
      # room = Factory.create(Room, %{creatorId: user.id})
      # Rooms.join_room(room, user.id)
      # assert Rooms.get_room_status(user.id) == {:creator, room}

      # if user it not creator
      # listener
      # room = Factory.create(Room)
      # Beef.Rooms.join_room(room, user.id)
      # assert Rooms.get_room_status(user.id) == {:listener, room}

      # # mod
      # Beef.Data.RoomPermission.insert(%{ userId: user.id, roomId: room.id, isMod: true })
      # assert Rooms.get_room_status(user.id) == {:mod, room}

      # # speaker
      # Beef.Data.RoomPermission.upsert(%{ userId: user.id, roomId: room.id }, %{ isMod: false, isSpeaker: true })
      # assert Rooms.get_room_status(user.id) == {:speaker, room}

      # # askedToSpeak
      # Beef.Data.RoomPermission.upsert(%{ userId: user.id, roomId: room.id }, %{ isMod: false, isSpeaker: false, askedToSpeak: true })
      # assert Rooms.get_room_status(user.id) == {:askedToSpeak, room}
    end

    test "can_join_room" do
      u = Factory.create(User)

      # non existent room
      assert Beef.Rooms.can_join_room("f6834652-b876-4641-9639-c5d04d87dc96", u.id) == {:error, "room doesn't exist anymore"}

      max_room_size = Application.fetch_env!(:kousa, :max_room_size)

      room = Factory.create(Room, [{ :numPeopleInside, max_room_size }])
      assert Beef.Rooms.can_join_room(room.id, u.id) == {:error, "room is full"}

      room2 = Factory.create(Room)
      Kousa.Data.RoomBlock.insert(%{ userId: u.id, roomId: room2.id, modId: u.id })
      assert Beef.Rooms.can_join_room(room2.id, u.id) == {:error, "you are blocked from the room"}

      creator = Factory.create(User)
      room3 = Factory.create(Room, [{ :creatorId, creator.id }])
      Beef.UserBlocks.insert(%{ userId: creator.id, userIdBlocked: u.id })
      assert Beef.Rooms.can_join_room(room3.id, u.id) == {:error, "the creator of the room blocked you"}


      room4 = Factory.create(Room)
      assert Beef.Rooms.can_join_room(room4.id, u.id) == {:ok, room4}
    end

    # still need to get to
    test "get_top_public_rooms" do

    end

    test "get_room_by_id" do
      room = Factory.create(Room)
      room2 = Factory.create(Room)
      assert Beef.Rooms.get_room_by_id(room.id) == room
      assert Beef.Rooms.get_room_by_id(room2.id) == room2
    end

    # still need to get to
    test "get_next_creator_for_room" do

    end

    test "get_a_user_for_room" do
      room = Factory.create(Room)
      userForRoom = Factory.create(User, [{ :currentRoomId, room.id }])
      notUserForRoom = Factory.create(User)

      assert Beef.Rooms.get_a_user_for_room(room.id) == userForRoom
    end

    test "get_room_by_creator_id" do
      u = Factory.create(User)
      createdByU = Factory.create(Room, [{ :creatorId, u.id }])
      notCreatedByU = Factory.create(Room)

      assert Beef.Rooms.get_room_by_creator_id(u.id) == createdByU
      refute Beef.Rooms.get_room_by_creator_id(u.id) == notCreatedByU
    end

    test "owner?" do
      u = Factory.create(User)
      r = Factory.create(Room)

      assert !Beef.Rooms.owner?(r.id, u.id)

      r2 = Factory.create(Room, [{ :creatorId, u.id }])
      assert Beef.Rooms.owner?(r2.id, u.id)
    end

    test "all_rooms" do
      Factory.create(Room)
      Factory.create(Room)
      Factory.create(Room)

      assert [%Room{}, %Room{}, %Room{}] = Beef.Rooms.all_rooms()
    end

    # MUTATION tests
    test "set_room_privacy_by_creator_id" do
      %User{ id: id } = Factory.create(User)
      r = Factory.create(Room, [{ :isPrivate, false }, { :name, "dogeroom" }, { :creatorId, id }])
      assert !r.isPrivate and r.name == "dogeroom" and r.creatorId == id

      Beef.Rooms.set_room_privacy_by_creator_id(id, true, "newdogeroom")

      assert %{
        isPrivate: true,
        creatorId: ^id,
        name: "newdogeroom"
      } = Repo.get!(Room, r.id)
    end

    test "join_room" do

    end

    test "increment_room_people_count/1" do
      %Room{
        id: id,
        numPeopleInside: numPeopleInside
        } = Factory.create(Room)

      assert numPeopleInside == 1

      Beef.Rooms.increment_room_people_count(id)
      assert %Room{ numPeopleInside: 2 } = Repo.get!(Room, id)
    end

    test "increment_room_people_count/2" do

    end

    test "delete_room_by_id" do

    end

    test "decrement_room_people_count" do

    end

    test "set_room_owner_and_dec" do

    end

    test "leave_room" do

    end

    test "update_name" do

    end

    test "create" do

    end

    test "edit" do

    end
  end
end

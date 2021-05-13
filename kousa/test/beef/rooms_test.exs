defmodule Kousa.Beef.RoomsTest do
  # allow tests to run in parallel
  use ExUnit.Case, async: true
  use KousaTest.Support.EctoSandbox

  alias KousaTest.Support.Factory
  alias Beef.Schemas.User
  alias Beef.Schemas.Room
  alias Beef.Rooms
  alias Beef.Repo
  alias Beef.RoomBlocks

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

    test "search_name" do
      room = Factory.create(Room)
      id = room.id
      assert [%{id: ^id}] = Rooms.search_name(room.name)
      assert [%{id: ^id}] = Rooms.search_name(String.slice(room.name, 0..2))
      assert [] = Rooms.search_name("akljdsjoqwdijo12")
      room2 = Factory.create(Room, name: "qiwodqwjdioqwdjiqwo", isPrivate: true)
      assert [] = Rooms.search_name(room2.name)
    end

    test "search_name orders by desc numPeopleInside" do
      %Room{
        id: id
      } = Factory.create(Room, [{:name, "room1"}])

      Beef.Rooms.increment_room_people_count(id)
      assert %Room{numPeopleInside: 2} = Repo.get!(Room, id)

      %Room{
        id: id
      } = Factory.create(Room, [{:name, "room2"}])

      # make sure room2 has 1 person inside
      assert %Room{numPeopleInside: 1} = Repo.get!(Room, id)

      # check if room1 shows up first as it has 2 ppl inside
      assert [%{name: "room1"}, %{name: "room2"}] = Rooms.search_name("room")

      Beef.Rooms.increment_room_people_count(id)
      Beef.Rooms.increment_room_people_count(id)

      # make sure room2 has 3 people inside
      assert %Room{numPeopleInside: 3} = Repo.get!(Room, id)

      # check if room2 shows up first as it has 3 ppl inside
      assert [%{name: "room2"}, %{name: "room1"}] = Rooms.search_name("room")
    end

    test "can_join_room" do
      u = Factory.create(User)

      # non existent room
      assert Beef.Rooms.can_join_room("f6834652-b876-4641-9639-c5d04d87dc96", u.id) ==
               {:error, "room doesn't exist anymore"}

      max_room_size = Application.fetch_env!(:kousa, :max_room_size)

      room = Factory.create(Room, [{:numPeopleInside, max_room_size}])
      assert Beef.Rooms.can_join_room(room.id, u.id) == {:error, "room is full"}

      room2 = Factory.create(Room)
      RoomBlocks.insert(%{userId: u.id, roomId: room2.id, modId: u.id})
      assert Beef.Rooms.can_join_room(room2.id, u.id) == {:error, "you are blocked from the room"}

      creator = Factory.create(User)
      room3 = Factory.create(Room, [{:creatorId, creator.id}])
      Beef.UserBlocks.insert(%{userId: creator.id, userIdBlocked: u.id})

      assert Beef.Rooms.can_join_room(room3.id, u.id) ==
               {:error, "the creator of the room blocked you"}

      room4 = Factory.create(Room)
      assert Beef.Rooms.can_join_room(room4.id, u.id) == {:ok, room4}
    end

    # still need to get to
    @tag :skip
    test "get_top_public_rooms" do
    end

    test "get_room_by_id" do
      room = Factory.create(Room)
      room2 = Factory.create(Room)
      assert Beef.Rooms.get_room_by_id(room.id) == room
      assert Beef.Rooms.get_room_by_id(room2.id) == room2
    end

    # still need to get to
    @tag :skip
    test "get_next_creator_for_room" do
    end

    test "get_a_user_for_room" do
      room = Factory.create(Room)
      userForRoom = Factory.create(User, [{:currentRoomId, room.id}])
      _notUserForRoom = Factory.create(User)

      assert Beef.Rooms.get_a_user_for_room(room.id) == userForRoom
    end

    test "get_room_by_creator_id" do
      u = Factory.create(User)
      createdByU = Factory.create(Room, [{:creatorId, u.id}])
      notCreatedByU = Factory.create(Room)

      assert Beef.Rooms.get_room_by_creator_id(u.id) == createdByU
      refute Beef.Rooms.get_room_by_creator_id(u.id) == notCreatedByU
    end

    test "owner?" do
      u = Factory.create(User)
      r = Factory.create(Room)

      assert !Beef.Rooms.owner?(r.id, u.id)

      r2 = Factory.create(Room, [{:creatorId, u.id}])
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
      %User{id: id} = Factory.create(User)
      r = Factory.create(Room, [{:isPrivate, false}, {:name, "dogeroom"}, {:creatorId, id}])
      assert !r.isPrivate and r.name == "dogeroom" and r.creatorId == id

      Beef.Rooms.set_room_privacy_by_creator_id(id, true, "newdogeroom")

      assert %{
               isPrivate: true,
               creatorId: ^id,
               name: "newdogeroom"
             } = Repo.get!(Room, r.id)
    end

    @tag :skip
    test "join_room" do
    end

    test "increment_room_people_count/1" do
      %Room{
        id: id,
        numPeopleInside: numPeopleInside
      } = Factory.create(Room)

      assert numPeopleInside == 1

      Beef.Rooms.increment_room_people_count(id)
      assert %Room{numPeopleInside: 2} = Repo.get!(Room, id)
    end

    @tag :skip
    test "increment_room_people_count/2" do
    end

    test "delete_room_by_id" do
      %Room{id: id} = Factory.create(Room)
      assert %Room{} = Repo.get!(Room, id)

      Beef.Rooms.delete_room_by_id(id)
      assert [] = Beef.Rooms.all_rooms()
    end

    @tag :skip
    test "decrement_room_people_count" do
    end

    @tag :skip
    # this isn't working atm, there is a problem with setting new_people_list?
    test "set_room_owner_and_dec" do
      # u = Factory.create(User)
      # %{
      #   id: new_owner_id,
      #   displayName: new_display_name,
      #   numFollowers: new_num_followers
      #   } = Factory.create(User)
      # r = Factory.create(Room, [
      #   { :numPeopleInside, 3 },
      #   { :creatorId, u.id }
      #   ])

      # assert r.creatorId == u.id

      # Beef.Rooms.set_room_owner_and_dec(
      #   r.id,
      #   new_owner_id,
      #   [%{
      #     id: new_owner_id,
      #     displayName: new_display_name,
      #     numFollowers: new_num_followers
      # }])

      # assert %{
      #   creatorId: ^new_owner_id,
      #   numPeopleInside: 2
      # } = Repo.get!(Room, r.id)
    end

    @tag :skip
    test "leave_room" do
    end

    test "raw_insert" do
      creator = Factory.create(User)

      Beef.Rooms.raw_insert(
        %{
          name: "cool room",
          creatorId: creator.id
        },
        [
          %{
            id: creator.id,
            displayName: creator.displayName,
            numFollowers: creator.numFollowers,
            avatarUrl: creator.avatarUrl
          }
        ]
      )

      creator2 = Factory.create(User)

      Beef.Rooms.raw_insert(
        %{
          name: "another cool room",
          creatorId: creator2.id
        },
        [
          %{
            id: creator2.id,
            displayName: creator2.displayName,
            numFollowers: creator2.numFollowers,
            avatarUrl: creator2.avatarUrl
          }
        ]
      )

      assert [%Room{}, %Room{}] = Repo.all(Room)
    end

    test "update_name" do
      creator = Factory.create(User)
      r = Factory.create(Room, [{:creatorId, creator.id}])

      refute r.name == "new cool name"
      Beef.Rooms.update_name(creator.id, "new cool name")

      assert %Room{
               name: "new cool name"
             } = Repo.get!(Room, r.id)
    end

    test "create" do
      %User{
        avatarUrl: avatarUrl,
        displayName: displayName,
        numFollowers: numFollowers,
        id: id
      } = Factory.create(User)

      {:ok, r} =
        Beef.Rooms.create(%{
          creatorId: id,
          name: "dogeruum",
          description: "a place to doge",
          isPrivate: false
        })

      assert %Room{
               peoplePreviewList: [
                 %User.Preview{
                   avatarUrl: ^avatarUrl,
                   displayName: ^displayName,
                   numFollowers: ^numFollowers,
                   id: ^id
                 }
               ]
             } = Repo.get!(Room, r.id)
    end

    test "edit" do
      r = Factory.create(Room)
      refute r.name == "updated name"

      {:ok, %Room{id: id}} =
        Beef.Rooms.edit(r.id, %{
          name: "updated name",
          isPrivate: true,
          description: "updated description"
        })

      assert %{
               id: ^id,
               name: "updated name",
               isPrivate: true,
               description: "updated description"
             } = Beef.Rooms.get_room_by_id(id)
    end
  end
end

defmodule Beef.Rooms do
  @moduledoc """
  Empty context module for Rooms
  """

  import Ecto.Query

  @fetch_limit 16

  alias Beef.Schemas.User
  alias Beef.Schemas.Room
  alias Beef.Schemas.UserBlock
  alias Beef.UserBlocks
  alias Beef.Repo

  def get_room_status(user_id) do
    room = Beef.Users.get_current_room(user_id)

    cond do
      is_nil(room) ->
        {nil, nil}

      room.creatorId == user_id ->
        {:creator, room}

      true ->
        {case Kousa.Data.RoomPermission.get(user_id, room.id) do
           %{isMod: true} -> :mod
           %{isSpeaker: true} -> :speaker
           %{askedToSpeak: true} -> :askedToSpeak
           _ -> :listener
         end, room}
    end
  end

  def set_room_privacy_by_creator_id(user_id, isPrivate, new_name) do
    from(r in Room,
      where: r.creatorId == ^user_id,
      update: [
        set: [
          isPrivate: ^isPrivate,
          name: ^new_name
        ]
      ],
      select: r
    )
    |> Beef.Repo.update_all([])
  end

  def can_join_room(room_id, user_id) do
    room = get_room_by_id(room_id)
    max_room_size = Application.fetch_env!(:kousa, :max_room_size)

    case room do
      nil ->
        {:error, "room doesn't exist anymore"}

      _ ->
        cond do
          room.numPeopleInside >= max_room_size ->
            {:error, "room is full"}

          Kousa.Data.RoomBlock.blocked?(room_id, user_id) ->
            {:error, "you are blocked from the room"}

          true ->
            cond do
              UserBlocks.blocked?(room.creatorId, user_id) ->
                {:error, "the creator of the room blocked you"}

              true ->
                {:ok, room}
            end
        end
    end
  end

  def join_room(room, user_id) do
    user = Beef.Users.set_current_room(user_id, room.id, room.isPrivate, true)

    if (length(room.peoplePreviewList) < 10 or
          not is_nil(
            Enum.find(room.peoplePreviewList, fn x ->
              x.numFollowers < user.numFollowers
            end)
          )) and is_nil(Enum.find(room.peoplePreviewList, &(&1.id === user_id))) do
      list =
        [
          %User.Preview{
            id: user.id,
            displayName: user.displayName,
            numFollowers: user.numFollowers
          }
          | room.peoplePreviewList
        ]
        |> Enum.sort(&(&1.numFollowers >= &2.numFollowers))
        |> Enum.slice(0, 10)

      increment_room_people_count(room.id, list)
    else
      increment_room_people_count(room.id)
    end

    user
  end

  def get_top_public_rooms(user_id, offset \\ 0) do
    max_room_size = Application.fetch_env!(:kousa, :max_room_size)

    items =
      from(r in Room,
        left_join: rb in Beef.RoomBlock,
        on: rb.roomId == r.id and rb.userId == ^user_id,
        left_join: ub in UserBlock,
        on: ub.userIdBlocked == ^user_id,
        where:
          is_nil(ub.userIdBlocked) and is_nil(rb.roomId) and r.isPrivate == false and
            r.numPeopleInside < ^max_room_size,
        order_by: [desc: r.numPeopleInside],
        offset: ^offset,
        limit: ^@fetch_limit
      )
      |> Beef.Repo.all()

    {Enum.slice(items, 0, -1 + @fetch_limit),
     if(length(items) == @fetch_limit, do: -1 + offset + @fetch_limit, else: nil)}
  end

  @spec get_room_by_id(any) :: any
  def get_room_by_id(room_id) do
    Beef.Repo.get(Room, room_id)
  end

  def delete_room_by_id(room_id) do
    %Room{id: room_id} |> Beef.Repo.delete()
  end

  def increment_room_people_count(room_id) do
    from(u in Room,
      where: u.id == ^room_id,
      update: [
        inc: [
          numPeopleInside: 1
        ]
      ]
    )
    |> Beef.Repo.update_all([])
  end

  def increment_room_people_count(room_id, new_people_list) do
    from(u in Room,
      where: u.id == ^room_id,
      update: [
        inc: [
          numPeopleInside: 1
        ],
        set: [
          peoplePreviewList: ^new_people_list
        ]
      ]
    )
    |> Beef.Repo.update_all([])
  end

  def decrement_room_people_count(room_id, new_people_list) do
    from(r in Room,
      where: r.id == ^room_id,
      update: [
        inc: [
          numPeopleInside: -1
        ],
        set: [
          peoplePreviewList: ^new_people_list
        ]
      ]
    )
    |> Beef.Repo.update_all([])
  end

  @user_order """
    (case
      when ? then 1
      else 2
    end)
  """
  @spec get_next_creator_for_room(any) :: any
  def get_next_creator_for_room(room_id) do
    from(u in User,
      inner_join: rp in Beef.RoomPermission,
      on: rp.roomId == ^room_id and rp.userId == u.id and u.currentRoomId == ^room_id,
      where: rp.isSpeaker == true,
      limit: 1,
      order_by: [
        asc: fragment(@user_order, rp.isMod)
      ]
    )
    |> Beef.Repo.one()
  end

  def get_a_user_for_room(room_id) do
    from(u in User,
      where: u.currentRoomId == ^room_id,
      limit: 1
    )
    |> Beef.Repo.one()
  end

  def set_room_owner_and_dec(room_id, user_id, new_people_list) do
    from(u in Room,
      where: u.id == ^room_id,
      update: [
        set: [
          creatorId: ^user_id,
          peoplePreviewList: ^new_people_list
        ],
        inc: [
          numPeopleInside: -1
        ]
      ]
    )
    |> Beef.Repo.update_all([])
  end

  def get_room_by_creator_id(creator_id) do
    from(u in Room,
      where: u.creatorId == ^creator_id,
      limit: 1
    )
    |> Beef.Repo.one()
  end

  # trusts that the user is in the room
  def leave_room(user_id, room_id) do
    room = get_room_by_id(room_id)

    if not is_nil(room) do
      if room.numPeopleInside <= 1 do
        # IO.puts("delete_room_by_id")
        delete_room_by_id(room.id)
        {:bye, room}
      else
        # IO.puts("set_user_left_current_room")
        Beef.Users.set_user_left_current_room(user_id)
        new_people_list = Enum.filter(room.peoplePreviewList, fn x -> x.id != user_id end)

        if room.creatorId != user_id do
          # IO.puts("increment_room_people_count")

          decrement_room_people_count(
            room.id,
            new_people_list
          )
        else
          # IO.puts("get_next_creator_for_room")
          newCreator = get_next_creator_for_room(room.id)

          if newCreator do
            # IO.puts("set_room_owner")
            set_room_owner_and_dec(room.id, newCreator.id, new_people_list)
            {:new_creator_id, newCreator.id}
          else
            # IO.puts("delete_room_by_id")
            delete_room_by_id(room.id)
            # IO.puts("end_fn")
            {:bye, room}
          end
        end
      end
    end
  end

  def raw_insert(data, peoplePreviewList) do
    %Room{peoplePreviewList: peoplePreviewList}
    |> Room.insert_changeset(data)
    |> Beef.Repo.insert(returning: true)
  end

  def update_name(user_id, name) do
    from(r in Room,
      where: r.creatorId == ^user_id,
      update: [
        set: [
          name: ^name
        ]
      ]
    )
    |> Beef.Repo.update_all([])
  end

  @spec create(:invalid | %{optional(:__struct__) => none, optional(atom | binary) => any}) :: any
  def create(data) do
    user = Beef.Users.get_by_id(data.creatorId)

    peoplePreviewList = [
      %{id: user.id, displayName: user.displayName, numFollowers: user.numFollowers}
    ]

    resp = raw_insert(data, peoplePreviewList)

    resp =
      case resp do
        {:error, %{errors: [{:creatorId, {"has already been taken", _}}]}} ->
          raw_insert(data, peoplePreviewList)

        _ ->
          resp
      end

    # IO.inspect(resp)

    case resp do
      {:ok, room} ->
        Beef.Users.set_current_room(data.creatorId, room.id)

      _ ->
        nil
    end

    resp
  end

  def owner?(room_id, user_id) do
    not is_nil(
      Beef.Repo.one(from(r in Room, where: r.id == ^room_id and r.creatorId == ^user_id))
    )
  end

  def edit(room_id, data) do
    %Room{id: room_id}
    |> Room.edit_changeset(data)
    |> Beef.Repo.update()
  end
  def all_rooms() do
    Repo.all(Room)
  end
end

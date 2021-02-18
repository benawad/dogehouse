defmodule Kousa.Data.Room do
  import Ecto.Query

  @fetch_limit 16

  def get_room_status(user_id) do
    room = Kousa.Data.User.get_current_room(user_id)

    cond do
      is_nil(room) ->
        {nil, nil}

      room.creatorId == user_id ->
        {:creator, room}

      true ->
        user = Kousa.Data.User.get_by_id(user_id)

        {cond do
           room.id == user.modForRoomId -> :mod
           room.id == user.canSpeakForRoomId -> :speaker
           true -> :listener
         end, room}
    end
  end

  def set_room_privacy_by_creator_id(user_id, isPrivate, new_name) do
    from(r in Beef.Room,
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

          Kousa.Data.RoomBlock.is_blocked(room_id, user_id) ->
            {:error, "you are blocked from the room"}

          true ->
            cond do
              Kousa.Data.UserBlock.is_blocked(room.creatorId, user_id) ->
                {:error, "the creator of the room blocked you"}

              true ->
                {:ok, room}
            end
        end
    end
  end

  def join_room(room, user_id) do
    {_, [user]} = Kousa.Data.User.set_current_room(user_id, room.id, room.isPrivate, true)

    if (length(room.peoplePreviewList) < 10 or
          not is_nil(
            Enum.find(room.peoplePreviewList, fn x ->
              x.numFollowers < user.numFollowers
            end)
          )) and is_nil(Enum.find(room.peoplePreviewList, &(&1.id === user_id))) do
      list =
        [
          %Beef.UserPreview{
            id: user.id,
            displayName: user.displayName,
            numFollowers: user.numFollowers,
            canSpeakForRoomId: user.canSpeakForRoomId
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
      from(r in Beef.Room,
        left_join: rb in Beef.RoomBlock,
        on: rb.roomId == r.id and rb.userId == ^user_id,
        left_join: ub in Beef.UserBlock,
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

  def get_room_by_id(room_id) do
    Beef.Repo.get(Beef.Room, room_id)
  end

  def delete_room_by_id(room_id) do
    %Beef.Room{id: room_id} |> Beef.Repo.delete()
  end

  def increment_room_people_count(room_id) do
    from(u in Beef.Room,
      where: u.id == ^room_id,
      update: [
        inc: [
          numPeopleInside: 1
        ]
      ]
    )
    |> Beef.Repo.update_all([])
  end

  def set_can_speak(room_id, new_people_list) do
    from(r in Beef.Room,
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

  def increment_room_people_count(room_id, new_people_list) do
    from(u in Beef.Room,
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
    from(r in Beef.Room,
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
    (case(?::uuid)
      when ? then 1
      when ? then 2
      else 3
    end)
  """
  @spec get_next_creator_for_room(any) :: any
  def get_next_creator_for_room(room_id) do
    {_, bin_room_id} = Ecto.UUID.dump(room_id)

    from(u in Beef.User,
      where: u.modForRoomId == ^room_id or u.canSpeakForRoomId == ^room_id,
      limit: 1,
      order_by: [
        asc: fragment(@user_order, ^bin_room_id, u.modForRoomId, u.canSpeakForRoomId)
      ]
    )
    |> Beef.Repo.one()
  end

  def get_a_mod_for_room(room_id) do
    from(u in Beef.User,
      where: u.modForRoomId == ^room_id,
      limit: 1
    )
    |> Beef.Repo.one()
  end

  def get_a_user_for_room(room_id) do
    from(u in Beef.User,
      where: u.currentRoomId == ^room_id,
      limit: 1
    )
    |> Beef.Repo.one()
  end

  def set_room_owner_and_dec(room_id, user_id, new_people_list) do
    from(u in Beef.Room,
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
    from(u in Beef.Room,
      where: u.creatorId == ^creator_id,
      limit: 1
    )
    |> Beef.Repo.one()
  end

  # trusts that the user is in the room
  def leave_room(user_id, room_id) do
    room = get_room_by_id(room_id)

    if room do
      if room.numPeopleInside <= 1 do
        # IO.puts("delete_room_by_id")
        delete_room_by_id(room.id)
        {:bye}
      else
        # IO.puts("set_user_left_current_room")
        Kousa.Data.User.set_user_left_current_room(user_id)
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
            {:bye}
          end
        end
      end
    end
  end

  def raw_insert(data, peoplePreviewList) do
    %Beef.Room{peoplePreviewList: peoplePreviewList}
    |> Beef.Room.insert_changeset(data)
    |> Beef.Repo.insert(returning: true)
  end

  def update_name(user_id, name) do
    from(r in Beef.Room,
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
    user = Kousa.Data.User.get_by_id(data.creatorId)
    current_room_id = Kousa.Data.User.get_current_room_id(data.creatorId)

    peoplePreviewList = [
      %{id: user.id, displayName: user.displayName, numFollowers: user.numFollowers, canSpeakForRoomId: current_room_id}
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
        Kousa.Data.User.set_current_room(data.creatorId, room.id, true)

      _ ->
        nil
    end

    resp
  end

  def is_owner(room_id, user_id) do
    not is_nil(
      Beef.Repo.one(from(r in Beef.Room, where: r.id == ^room_id and r.creatorId == ^user_id))
    )
  end

  def is_speaker(room_id, user_id) do
    not is_nil(
      Beef.Repo.one(
        from(u in Beef.User, where: u.canSpeakForRoomId == ^room_id and u.id == ^user_id)
      )
    )
  end
end

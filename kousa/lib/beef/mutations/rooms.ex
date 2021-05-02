defmodule Beef.Mutations.Rooms do
  import Ecto.Query

  alias Beef.Repo
  alias Beef.Schemas.Room
  alias Beef.Users
  alias Beef.Schemas.User

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
    |> Repo.update_all([])
  end

  def join_room(room, user_id) do
    user = Users.set_current_room(user_id, room.id, room.isPrivate, true)

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
            numFollowers: user.numFollowers,
            avatarUrl: user.avatarUrl
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

  def increment_room_people_count(room_id) do
    from(u in Room,
      where: u.id == ^room_id,
      update: [
        inc: [
          numPeopleInside: 1
        ]
      ]
    )
    |> Repo.update_all([])
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
    |> Repo.update_all([])
  end

  def delete_room_by_id(room_id) do
    %Room{id: room_id} |> Repo.delete()
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
    |> Repo.update_all([])
  end

  def replace_room_owner(user_id, new_creator_id) do
    from(r in Room,
      where: r.creatorId == ^user_id,
      update: [
        set: [
          creatorId: ^new_creator_id
        ]
      ]
    )
    |> Repo.update_all([])
  end

  # trusts that the user is in the room
  def kick_from_room(user_id, room_id) do
    room = Beef.Rooms.get_room_by_id(room_id)
    Beef.Users.set_user_left_current_room(user_id)
    new_people_list = Enum.filter(room.peoplePreviewList, fn x -> x.id != user_id end)

    decrement_room_people_count(
      room.id,
      new_people_list
    )
  end

  # trusts that the user is in the room
  def leave_room(user_id, room_id) do
    room = Beef.Rooms.get_room_by_id(room_id)

    if not is_nil(room) do
      if room.numPeopleInside <= 1 do
        delete_room_by_id(room.id)
        {:bye, room}
      else
        Beef.Users.set_user_left_current_room(user_id)
        new_people_list = Enum.filter(room.peoplePreviewList, fn x -> x.id != user_id end)

        if room.creatorId != user_id do
          decrement_room_people_count(
            room.id,
            new_people_list
          )
        else
          newCreator = Beef.Rooms.get_next_creator_for_room(room.id)

          if newCreator do
            set_room_owner_and_dec(room.id, newCreator.id, new_people_list)
            {:new_creator_id, newCreator.id}
          else
            delete_room_by_id(room.id)
            {:bye, room}
          end
        end
      end
    end
  end

  def raw_insert(data, peoplePreviewList) do
    %Room{peoplePreviewList: peoplePreviewList}
    |> Room.insert_changeset(data)
    |> Repo.insert(returning: true)
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
    |> Repo.update_all([])
  end

  @spec create(:invalid | %{optional(:__struct__) => none, optional(atom | binary) => any}) :: any
  def create(data) do
    user = Beef.Users.get_by_id(data.creatorId)

    peoplePreviewList = [
      %{
        id: user.id,
        displayName: user.displayName,
        numFollowers: user.numFollowers,
        avatarUrl: user.avatarUrl
      }
    ]

    resp = raw_insert(data, peoplePreviewList)

    resp =
      case resp do
        {:error, %{errors: [{:creatorId, {"has already been taken", _}}]}} ->
          raw_insert(data, peoplePreviewList)

        _ ->
          resp
      end

    case resp do
      {:ok, room} ->
        Beef.Users.set_current_room(data.creatorId, room.id)

      _ ->
        nil
    end

    resp
  end

  def edit(room_id, data) do
    %Room{id: room_id}
    |> Room.edit_changeset(data)
    |> Repo.update()
  end
end

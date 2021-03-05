defmodule Beef.Mutations.User do
  import Ecto.Query, warn: false

  alias Beef.Repo
  alias Beef.Schemas.User

  def edit_profile(user_id, data) do
    %User{id: user_id}
    |> User.edit_changeset(data)
    |> Repo.update()
  end

  def delete(user_id) do
    %User{id: user_id} |> Repo.delete()
  end

  def bulk_insert(users) do
    Repo.insert_all(
      User,
      users,
      on_conflict: :nothing
    )
  end

  def inc_num_following(user_id, n) do
    from(u in User,
      where: u.id == ^user_id,
      update: [
        inc: [
          numFollowing: ^n
        ]
      ]
    )
    |> Repo.update_all([])
  end

  def set_reason_for_ban(user_id, reason_for_ban) do
    from(u in User,
      where: u.id == ^user_id,
      update: [
        set: [
          reasonForBan: ^reason_for_ban
        ]
      ]
    )
    |> Repo.update_all([])
  end

  def set_online(user_id) do
    from(u in User,
      where: u.id == ^user_id,
      update: [
        set: [
          online: true
        ]
      ]
    )
    |> Repo.update_all([])
  end

  def set_user_left_current_room(user_id) do
    Kousa.RegUtils.lookup_and_cast(Kousa.Gen.UserSession, user_id, {:set_current_room_id, nil})

    from(u in User,
      where: u.id == ^user_id,
      update: [
        set: [
          currentRoomId: nil
        ]
      ]
    )
    |> Repo.update_all([])
  end

  def set_offline(user_id) do
    from(u in User,
      where: u.id == ^user_id,
      update: [
        set: [
          online: false,
          lastOnline: fragment("now()")
        ]
      ]
      # select: u
    )
    |> Repo.update_all([])
  end
end

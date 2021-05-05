defmodule Beef.RoomPermissions do
  import Ecto.Query

  def insert(data) do
    %Beef.Schemas.RoomPermission{}
    |> Beef.Schemas.RoomPermission.insert_changeset(data)
    |> Beef.Repo.insert(on_conflict: :nothing)
  end

  def upsert(data, set, returning \\ true) do
    %Beef.Schemas.RoomPermission{}
    |> Beef.Schemas.RoomPermission.insert_changeset(data)
    |> Beef.Repo.insert(
      on_conflict: [set: set],
      conflict_target: [:userId, :roomId],
      returning: returning
    )
  end

  def speaker?(user_id, room_id) do
    not is_nil(
      Beef.Repo.one(
        from(rp in Beef.Schemas.RoomPermission,
          where: rp.roomId == ^room_id and rp.userId == ^user_id and rp.isSpeaker == true
        )
      )
    )
  end

  def listener?(user_id, room_id) do
    not speaker?(user_id, room_id)
  end

  def mod?(user_id, room_id) do
    not is_nil(
      Beef.Repo.one(
        from(rp in Beef.Schemas.RoomPermission,
          where: rp.roomId == ^room_id and rp.userId == ^user_id and rp.isMod == true
        )
      )
    )
  end

  def asked_to_speak?(user_id, room_id) do
    not is_nil(
      Beef.Repo.one(
        from(rp in Beef.Schemas.RoomPermission,
          where: rp.roomId == ^room_id and rp.userId == ^user_id and rp.askedToSpeak == true
        )
      )
    )
  end

  def get(user_id, room_id) do
    from(rp in Beef.Schemas.RoomPermission,
      where: rp.userId == ^user_id and rp.roomId == ^room_id,
      limit: 1
    )
    |> Beef.Repo.one()
  end

  def ask_to_speak(user_id, room_id) do
    upsert(%{roomId: room_id, userId: user_id, askedToSpeak: true}, askedToSpeak: true)
  end

  def set_speaker(user_id, room_id, speaker?, returning \\ false) do
    upsert(
      %{roomId: room_id, userId: user_id, isSpeaker: speaker?},
      [isSpeaker: speaker?],
      returning
    )
  end

  def set_is_mod(user_id, room_id, is_mod) do
    upsert(
      %{roomId: room_id, userId: user_id, isMod: is_mod},
      [isMod: is_mod],
      false
    )
  end

  def make_listener(user_id, room_id) do
    upsert(
      %{roomId: room_id, userId: user_id, isSpeaker: false, askedToSpeak: false},
      [isSpeaker: false, askedToSpeak: false],
      false
    )
  end
end

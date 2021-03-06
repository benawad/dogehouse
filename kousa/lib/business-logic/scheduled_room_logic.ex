defmodule Kousa.BL.ScheduledRoom do
  use Kousa.Dec.Atomic
  alias Kousa.BL
  alias Kousa.Data
  alias Kousa.Errors
  alias Beef.Schemas.ScheduledRoom

  def create_room_from_scheduled_room(user_id, scheduled_room_id, name, description) do
    with {:ok, response} <- BL.Room.create_room(user_id, name, description, false) do
      Data.ScheduledRoom.room_started(user_id, scheduled_room_id, response.room.id)
      {:ok, response}
    else
      error -> error
    end
  end

  def delete(user_id, id) do
    Data.ScheduledRoom.delete(user_id, id)
  end

  def edit(user_id, id, data) do
    case Data.ScheduledRoom.edit(user_id, id, data) do
      :ok ->
        :ok

      {:error, err} ->
        {:error, Errors.changeset_to_first_err_message(err)}
    end
  end

  @spec schedule(String.t(), any) :: {:ok, ScheduledRoom.t()} | {:error, Ecto.Changeset.t()}
  def schedule(user_id, data) do
    # @todo add to followers notifications

    case Data.ScheduledRoom.insert(Map.put(data, "creatorId", user_id)) do
      {:ok, scheduled_room} ->
        {:ok, scheduled_room}

      {:error, err} ->
        {:error, Errors.changeset_to_first_err_message(err)}
    end
  end

  @spec get_scheduled_rooms(binary, boolean, String.t() | nil) ::
          {[ScheduledRoom], nil | number}
  def get_scheduled_rooms(user_id, get_only_my_scheduled_rooms, cursor) do
    Data.ScheduledRoom.get_feed(user_id, get_only_my_scheduled_rooms, cursor)
  end

  def get_my_scheduled_rooms_about_to_start(user_id) do
    Data.ScheduledRoom.get_my_scheduled_rooms_about_to_start(user_id)
  end

  def get_my_scheduled_room(user_id) do
    Data.ScheduledRoom.get_mine(user_id)
  end
end

defmodule Kousa.BL.ScheduledRoom do
  use Kousa.Dec.Atomic
  alias Kousa.{BL, Data, RegUtils, Gen, Caster, VoiceServerUtils, Errors}
  alias Beef.{ScheduledRoom}

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
          {[Beef.ScheduledRoom], nil | number}
  def get_scheduled_rooms(user_id, get_only_my_scheduled_rooms, cursor) do
    Data.ScheduledRoom.get_feed(user_id, get_only_my_scheduled_rooms, cursor)
  end

  def get_my_scheduled_room(user_id) do
    Data.ScheduledRoom.get_mine(user_id)
  end
end

defmodule Beef.Schemas.ScheduledRoom do
  use Ecto.Schema
  import Ecto.Changeset
  alias Beef.Room
  alias Beef.Schemas.User
  @timestamps_opts [type: :utc_datetime_usec]

  @type t :: %__MODULE__{
          id: Ecto.UUID.t(),
          name: String.t(),
          numAttending: integer(),
          scheduledFor: DateTime.t()
        }

  @derive {Jason.Encoder,
           only: [
             :id,
             :name,
             :numAttending,
             :scheduledFor,
             :description,
             :roomId,
             :creator,
             :creatorId
           ]}

  @primary_key {:id, :binary_id, []}
  schema "scheduled_rooms" do
    field(:name, :string)
    field(:numAttending, :integer)
    field(:scheduledFor, :utc_datetime_usec)
    field(:description, :string, default: "")
    field(:started, :boolean)

    belongs_to(:creator, User, foreign_key: :creatorId, type: :binary_id)
    belongs_to(:room, Room, foreign_key: :roomId, type: :binary_id)

    timestamps()
  end

  def validate_future_date(%{changes: changes} = changeset, field) do
    if date = changes[field] do
      if DateTime.compare(date, DateTime.utc_now()) == :gt do
        changeset
      else
        changeset
        |> add_error(field, "Date needs to be in the future")
      end
    else
      changeset
    end
  end

  def validate_not_too_far_into_future_date(%{changes: changes} = changeset, field) do
    if date = changes[field] do
      # 1 extra day to avoid conflicts with frontend
      max_date = DateTime.utc_now() |> Timex.shift(months: 6, days: 1)

      if DateTime.compare(date, max_date) == :lt do
        changeset
      else
        changeset
        |> add_error(field, "Date can't be further than 6 month in advance")
      end
    else
      changeset
    end
  end

  def common_validation(attrs) do
    attrs
    |> validate_future_date(:scheduledFor)
    |> validate_not_too_far_into_future_date(:scheduledFor)
    |> validate_length(:name, min: 2, max: 60)
    |> validate_length(:description, max: 200)
  end

  @doc false
  def insert_changeset(room, attrs) do
    room
    |> cast(attrs, [:id, :name, :creatorId, :scheduledFor, :description])
    |> validate_required([:name, :creatorId, :scheduledFor])
    |> common_validation()
  end

  def edit_changeset(room, attrs) do
    room
    |> cast(attrs, [:id, :name, :scheduledFor, :description])
    |> validate_required([:name, :scheduledFor])
    |> common_validation()
  end
end

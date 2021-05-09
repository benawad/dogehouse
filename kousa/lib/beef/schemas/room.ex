defmodule Beef.Schemas.Room do
  use Ecto.Schema
  use Broth.Message.Push
  import Ecto.Changeset
  @timestamps_opts [type: :utc_datetime_usec]

  alias Beef.Schemas.User
  @type chatMode :: :default | :disabled | :follower_only
  @type t :: %__MODULE__{
          id: Ecto.UUID.t(),
          name: String.t(),
          description: String.t(),
          numPeopleInside: integer(),
          isPrivate: boolean(),
          user: User.t() | Ecto.Association.NotLoaded.t(),
          peoplePreviewList: [User.Preview.t()]
        }

  @derive {Jason.Encoder,
           only:
             ~w(id name description numPeopleInside isPrivate chatMode chatThrottle autoSpeaker
           creatorId peoplePreviewList voiceServerId inserted_at)a}

  @primary_key {:id, :binary_id, []}
  schema "rooms" do
    field(:name, :string)
    field(:description, :string, default: "")
    field(:numPeopleInside, :integer)
    field(:isPrivate, :boolean)
    field(:voiceServerId, :string)
    field(:autoSpeaker, :boolean, default: false)
    field(:chatThrottle, :integer, default: 1000)
    field(:chatMode, Ecto.Enum, values: [:default, :disabled, :follower_only])

    # TODO: change this to creator!
    belongs_to(:user, User, foreign_key: :creatorId, type: :binary_id)
    embeds_many(:peoplePreviewList, User.Preview)

    timestamps()
  end

  @spec insert_changeset(
          {map, map} | %{:__struct__ => atom | %{__changeset__: map}, optional(atom) => any},
          :invalid | %{optional(:__struct__) => none, optional(atom | binary) => any}
        ) :: Ecto.Changeset.t()
  @doc false
  def insert_changeset(room, attrs) do
    room
    |> cast(attrs, [
      :id,
      :name,
      :creatorId,
      :isPrivate,
      :numPeopleInside,
      :voiceServerId,
      :description,
      :chatMode,
      :chatThrottle,
      :autoSpeaker
    ])
    |> validate_required([:name, :creatorId])
    |> validate_length(:name, min: 2, max: 60)
    |> validate_length(:description, max: 500)
    |> unique_constraint(:creatorId)
  end

  @spec edit_changeset(
          {map, map} | %{:__struct__ => atom | %{__changeset__: map}, optional(atom) => any},
          :invalid | %{optional(:__struct__) => none, optional(atom | binary) => any}
        ) :: Ecto.Changeset.t()
  def edit_changeset(room, attrs) do
    room
    |> cast(attrs, [:id, :name, :isPrivate, :description, :autoSpeaker, :chatMode, :chatThrottle])
    |> validate_length(:name, min: 2, max: 60)
    |> validate_number(:chatThrottle, greater_than_or_equal_to: 0)
    |> validate_length(:description, max: 500)
  end
end

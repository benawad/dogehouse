defmodule Beef.Room do
  use Ecto.Schema
  import Ecto.Changeset
  @timestamps_opts [type: :utc_datetime_usec]

  @type t :: %__MODULE__{
          id: Ecto.UUID.t(),
          name: String.t(),
          numPeopleInside: integer(),
          isPrivate: boolean(),
          user: User.t() | Ecto.Association.NotLoaded.t(),
          peoplePreviewList: [UserPreview.t()]
        }

  @derive {Poison.Encoder,
           only: [
             :id,
             :name,
             :numPeopleInside,
             :isPrivate,
             :creatorId,
             :peoplePreviewList,
             :voiceServerId
           ]}
  @primary_key {:id, :binary_id, []}
  schema "rooms" do
    field(:name, :string)
    field(:numPeopleInside, :integer)
    field(:isPrivate, :boolean)
    field(:voiceServerId, :string)

    belongs_to(:user, Beef.User, foreign_key: :creatorId, type: :binary_id)
    embeds_many(:peoplePreviewList, Beef.UserPreview)

    timestamps()
  end

  @spec insert_changeset(
          {map, map} | %{:__struct__ => atom | %{__changeset__: map}, optional(atom) => any},
          :invalid | %{optional(:__struct__) => none, optional(atom | binary) => any}
        ) :: Ecto.Changeset.t()
  @doc false
  def insert_changeset(room, attrs) do
    room
    |> cast(attrs, [:id, :name, :creatorId, :isPrivate, :numPeopleInside, :voiceServerId])
    |> validate_required([:name, :creatorId])
    |> validate_length(:name, min: 2, max: 60)
    |> unique_constraint(:creatorId)
  end
end

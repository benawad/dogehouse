defmodule Beef.Room do
  use Ecto.Schema
  import Ecto.Changeset

  alias Beef.{User, UserPreview}

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
             :peoplePreviewList
           ]}
  @primary_key {:id, :binary_id, []}
  schema "rooms" do
    field(:name, :string)
    field(:numPeopleInside, :integer)
    field(:isPrivate, :boolean)

    belongs_to(:user, Beef.User, foreign_key: :creatorId, type: :binary_id)
    embeds_many(:peoplePreviewList, Beef.UserPreview)

    timestamps()
  end

  @doc false
  def insert_changeset(room, attrs) do
    room
    |> cast(attrs, [:id, :name, :creatorId, :isPrivate, :numPeopleInside])
    |> validate_required([:name, :creatorId])
    |> validate_length(:name, min: 2)
    |> unique_constraint(:creatorId)
  end
end

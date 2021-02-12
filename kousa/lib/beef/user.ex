defmodule Beef.User do
  use Ecto.Schema
  import Ecto.Changeset

  alias Beef.Room

  @type t :: %__MODULE__{
          id: Ecto.UUID.t(),
          githubId: String.t(),
          username: String.t(),
          email: String.t(),
          githubAccessToken: String.t(),
          displayName: String.t(),
          avatarUrl: String.t(),
          bio: String.t(),
          reasonForBan: String.t(),
          tokenVersion: integer(),
          numFollowing: integer(),
          numFollowers: integer(),
          hasLoggedIn: boolean(),
          online: boolean(),
          lastOnline: NaiveDateTime.t(),
          youAreFollowing: boolean(),
          followsYou: boolean(),
          currentRoom: Room.t() | Ecto.Association.NotLoaded.t(),
          modForRoom: Room.t() | Ecto.Association.NotLoaded.t(),
          canSpeakForRoom: Room.t() | Ecto.Association.NotLoaded.t()
        }

  @derive {Poison.Encoder,
           only: [
             :id,
             :username,
             :avatarUrl,
             :bio,
             :online,
             :lastOnline,
             :currentRoomId,
             :modForRoomId,
             :canSpeakForRoomId,
             :displayName,
             :numFollowing,
             :numFollowers,
             :currentRoom,
             :youAreFollowing,
             :followsYou
           ]}
  @primary_key {:id, :binary_id, []}
  schema "users" do
    field(:githubId, :string)
    field(:username, :string)
    field(:email, :string)
    field(:githubAccessToken, :string)
    field(:displayName, :string)
    field(:avatarUrl, :string)
    field(:bio, :string)
    field(:reasonForBan, :string)
    field(:tokenVersion, :integer)
    field(:numFollowing, :integer)
    field(:numFollowers, :integer)
    field(:hasLoggedIn, :boolean)
    field(:online, :boolean)
    field(:lastOnline, :naive_datetime)
    field(:youAreFollowing, :boolean, virtual: true)
    field(:followsYou, :boolean, virtual: true)

    belongs_to(:currentRoom, Room, foreign_key: :currentRoomId, type: :binary_id)
    belongs_to(:modForRoom, Room, foreign_key: :modForRoomId, type: :binary_id)
    belongs_to(:canSpeakForRoom, Room, foreign_key: :canSpeakForRoomId, type: :binary_id)

    timestamps()
  end

  @doc false
  def changeset(user, attrs) do
    user
    |> validate_required([:username, :githubId, :avatarUrl])
  end
end

defmodule Beef.Schemas.User do
  use Ecto.Schema
  import Ecto.Changeset
  alias Beef.Schemas.Room

  defmodule Preview do
    use Ecto.Schema

    # TODO: Make this a separate Schema that sees the same table.

    @derive {Poison.Encoder, only: [:id, :displayName, :numFollowers]}
    @primary_key false
    embedded_schema do
      # does User.Preview really need an id?
      field(:id, :binary_id)

      field(:displayName, :string)
      field(:numFollowers, :integer)
    end
  end

  @timestamps_opts [type: :utc_datetime_usec]

  @type t :: %__MODULE__{
          id: Ecto.UUID.t(),
          twitterId: String.t(),
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
          lastOnline: DateTime.t(),
          youAreFollowing: boolean(),
          followsYou: boolean(),
          roomPermissions: nil | Beef.Schemas.RoomPermission.t(),
          currentRoomId: Ecto.UUID.t(),
          currentRoom: Room.t() | Ecto.Association.NotLoaded.t()
        }

  @derive {Poison.Encoder, only: ~w(id username avatarUrl bio online
             lastOnline currentRoomId displayName numFollowing numFollowers
             currentRoom youAreFollowing followsYou roomPermissions)a}

  @primary_key {:id, :binary_id, []}
  schema "users" do
    field(:githubId, :string)
    field(:twitterId, :string)
    field(:username, :string)
    field(:email, :string)
    field(:githubAccessToken, :string)
    field(:displayName, :string)
    field(:avatarUrl, :string)
    field(:bio, :string, default: "")
    field(:reasonForBan, :string)
    field(:tokenVersion, :integer)
    field(:numFollowing, :integer)
    field(:numFollowers, :integer)
    field(:hasLoggedIn, :boolean)
    field(:online, :boolean)
    field(:lastOnline, :utc_datetime_usec)
    field(:youAreFollowing, :boolean, virtual: true)
    field(:followsYou, :boolean, virtual: true)
    field(:roomPermissions, :map, virtual: true, null: true)

    belongs_to(:currentRoom, Room, foreign_key: :currentRoomId, type: :binary_id)

    timestamps()
  end

  @doc false
  def changeset(user, attrs) do
    # TODO: amend this to accept *either* githubId or twitterId and also
    # pipe edit_changeset into this puppy.
    user
    |> cast(attrs, ~w(username githubId avatarUrl)a)
    |> validate_required([:username, :githubId, :avatarUrl])
  end

  def edit_changeset(user, attrs) do
    user
    |> cast(attrs, [:id, :username, :bio, :displayName, :avatarUrl])
    |> validate_required([:username, :displayName, :avatarUrl])
    |> update_change(:displayName, &String.trim/1)
    |> validate_length(:bio, min: 0, max: 160)
    |> validate_length(:displayName, min: 2, max: 50)
    |> validate_format(:username, ~r/^(\w){4,15}$/)
    |> validate_format(
      :avatarUrl,
      ~r/https?:\/\/(www\.|)(pbs.twimg.com\/profile_images\/(.*)\.(jpg|png|jpeg|webp)|avatars\.githubusercontent\.com\/u\/)/
    )
    |> unique_constraint(:username)
  end
end

defmodule Beef.Schemas.User do
  use Ecto.Schema

  # the struct defined here can also be pushed to the user
  use Broth.Message.Push
  import Ecto.Changeset
  alias Beef.Schemas.Room

  defmodule Preview do
    use Ecto.Schema

    # TODO: Make this a separate Schema that sees the same table.

    @derive {Poison.Encoder, only: [:id, :displayName, :numFollowers, :avatarUrl]}
    @derive {Jason.Encoder, only: [:id, :displayName, :numFollowers, :avatarUrl]}

    @primary_key false
    embedded_schema do
      # does User.Preview really need an id?
      field(:id, :binary_id)

      field(:displayName, :string)
      field(:numFollowers, :integer)
      field(:avatarUrl, :string)
    end
  end

  @timestamps_opts [type: :utc_datetime_usec]

  @type t :: %__MODULE__{
          id: Ecto.UUID.t(),
          twitterId: String.t(),
          githubId: String.t(),
          discordId: String.t(),
          username: String.t(),
          email: String.t(),
          githubAccessToken: String.t(),
          discordAccessToken: String.t(),
          displayName: String.t(),
          avatarUrl: String.t(),
          bannerUrl: String.t(),
          bio: String.t(),
          reasonForBan: String.t(),
          ip: nil | String.t(),
          tokenVersion: integer(),
          numFollowing: integer(),
          numFollowers: integer(),
          hasLoggedIn: boolean(),
          online: boolean(),
          lastOnline: DateTime.t(),
          youAreFollowing: nil | boolean(),
          followsYou: nil | boolean(),
          botOwnerId: nil | Ecto.UUID.t(),
          roomPermissions: nil | Beef.Schemas.RoomPermission.t(),
          currentRoomId: Ecto.UUID.t(),
          currentRoom: Room.t() | Ecto.Association.NotLoaded.t()
        }

  @derive {Poison.Encoder, only: ~w(id username avatarUrl bannerUrl bio online
             lastOnline currentRoomId displayName numFollowing numFollowers
             currentRoom youAreFollowing followsYou botOwnerId roomPermissions iBlockedThem)a}

  @primary_key {:id, :binary_id, []}
  schema "users" do
    field(:githubId, :string)
    field(:twitterId, :string)
    field(:discordId, :string)
    field(:username, :string)
    field(:email, :string)
    field(:githubAccessToken, :string)
    field(:discordAccessToken, :string)
    field(:displayName, :string)
    field(:avatarUrl, :string)
    field(:bannerUrl, :string)
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
    field(:muted, :boolean, virtual: true)
    field(:deafened, :boolean, virtual: true)
    field(:apiKey, :binary_id)
    field(:ip, :string, null: true)
    field(:theyBlockedMe, :boolean, virtual: true)
    field(:iBlockedThem, :boolean, virtual: true)

    belongs_to(:botOwner, Beef.Schemas.User, foreign_key: :botOwnerId, type: :binary_id)
    belongs_to(:currentRoom, Room, foreign_key: :currentRoomId, type: :binary_id)

    many_to_many(:blocked_by, __MODULE__,
      join_through: "user_blocks",
      join_keys: [userIdBlocked: :id, userId: :id]
    )

    many_to_many(:blocking, __MODULE__,
      join_through: "user_blocks",
      join_keys: [userId: :id, userIdBlocked: :id]
    )

    timestamps()
  end

  @doc false
  def changeset(user, attrs) do
    # TODO: amend this to accept *either* githubId or twitterId and also
    # pipe edit_changeset into this puppy.
    user
    |> cast(attrs, ~w(username githubId avatarUrl bannerUrl)a)
    |> validate_required([:username, :githubId, :avatarUrl, :bannerUrl])
  end

  def edit_changeset(user, attrs) do
    user
    |> cast(attrs, [
      :id,
      :username,
      :bio,
      :displayName,
      :avatarUrl,
      :bannerUrl,
      :apiKey,
      :botOwnerId
    ])
    |> validate_required([:username, :displayName, :avatarUrl])
    |> update_change(:displayName, &String.trim/1)
    |> validate_length(:bio, min: 0, max: 160)
    |> validate_length(:displayName, min: 2, max: 50)
    |> validate_format(:username, ~r/^[\w\.]{4,15}$/)
    |> validate_format(
      :avatarUrl,
      ~r/^https?:\/\/(www\.|)((a|p)bs.twimg.com\/(profile_images|sticky\/default_profile_images)\/(.*)\.(jpg|png|jpeg|webp)|avatars\.githubusercontent\.com\/u\/|github.com\/identicons\/[^\s]+)/
    )
    |> validate_format(
      :bannerUrl,
      ~r/^https?:\/\/(www\.|)(pbs.twimg.com\/profile_banners\/(.+)\/(.+)\/(.+)(?:\.(jpg|png|jpeg|webp))?|avatars\.githubusercontent\.com\/u\/)/
    )
    |> unique_constraint(:username)
  end

  defimpl Jason.Encoder do
    @fields ~w(id username avatarUrl bannerUrl bio online
  lastOnline currentRoomId currentRoom displayName numFollowing numFollowers
  youAreFollowing followsYou botOwnerId roomPermissions iBlockedThem)a

    defp transform_current_room(fields = %{currentRoom: %Ecto.Association.NotLoaded{}}) do
      Map.delete(fields, :currentRoom)
    end

    defp transform_current_room(fields), do: fields

    def encode(user, opts) do
      user
      |> Map.take(@fields)
      |> transform_current_room
      |> Jason.Encoder.encode(opts)
    end
  end
end

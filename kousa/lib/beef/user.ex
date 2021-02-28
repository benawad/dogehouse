defmodule Beef.User do
  use Ecto.Schema
  import Ecto.Changeset

  @derive {Poison.Encoder,
           only: [
             :id,
             :username,
             :avatarUrl,
             :bio,
             :online,
             :lastOnline,
             :currentRoomId,
             :displayName,
             :numFollowing,
             :numFollowers,
             :currentRoom,
             :youAreFollowing,
             :followsYou,
             :roomPermissions
           ]}
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
    field(:lastOnline, :naive_datetime)
    field(:youAreFollowing, :boolean, virtual: true)
    field(:followsYou, :boolean, virtual: true)
    field(:roomPermissions, :map, virtual: true, null: true)

    belongs_to(:currentRoom, Beef.Room, foreign_key: :currentRoomId, type: :binary_id)

    timestamps()
  end

  @doc false
  def changeset(user, _attrs) do
    user
    |> validate_required([:username, :githubId, :avatarUrl])
  end

  def edit_changeset(user, attrs) do
    user
    |> cast(attrs, [:id, :username, :bio, :displayName, :avatarUrl])
    |> validate_required([:username, :displayName, :avatarUrl])
    |> validate_length(:bio, min: 0, max: 160)
    |> validate_length(:displayName, min: 2, max: 50)
    |> validate_format(:username, ~r/^(\w){4,15}$/)
    |> validate_format(:avatarUrl, ~r/https?:\/\/(www\.|)(pbs.twimg.com\/profile_images\/(.*)\.(jpg|png|jpeg|webp)|avatars\.githubusercontent\.com\/u\/)/)
    |> unique_constraint(:username)
  end
end

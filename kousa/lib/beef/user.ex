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
             :modForRoomId,
             :canSpeakForRoomId,
             :displayName,
             :numFollowing,
             :numFollowers,
             :currentRoom,
             :youAreFollowing,
             :followsYou,
             :externalProfileLink
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
    field(:externalProfileLink, :string)

    belongs_to(:currentRoom, Beef.Room, foreign_key: :currentRoomId, type: :binary_id)
    belongs_to(:modForRoom, Beef.Room, foreign_key: :modForRoomId, type: :binary_id)
    belongs_to(:canSpeakForRoom, Beef.Room, foreign_key: :canSpeakForRoomId, type: :binary_id)

    timestamps()
  end

  @doc false
  def changeset(user, _attrs) do
    user
    |> validate_required([:username, :githubId, :avatarUrl])
  end

  def edit_changeset(user, attrs) do
    user
    |> cast(attrs, [:id, :username, :bio, :displayName, :externalProfileLink])
    |> validate_required([:username, :bio, :displayName])
    |> validate_length(:bio, min: 2, max: 160)
    |> validate_length(:displayName, min: 2, max: 50)
    |> validate_format(:username, ~r/^(\w){4,15}$/)
    |> validate_format(:externalProfileLink, ~r/^(http|https):\/\/[^ "]{0,255}$/)
    |> unique_constraint(:username)
  end
end

defmodule Broth.Message.Room.Create do
  use Broth.Message.Call,
    reply: __MODULE__,
    operation: "room:create:reply"

  @derive {Jason.Encoder, only: [:id, :creatorId, :name, :description, :isPrivate]}

  @primary_key {:id, :binary_id, []}
  schema "rooms" do
    field(:creatorId, :binary_id)
    field(:name, :string)
    field(:description, :string)
    field(:isPrivate, :boolean, default: false)
    field(:userIdsToInvite, {:array, :binary_id}, virtual: true)
    field(:autoSpeaker, :boolean, virtual: true)
  end

  import Ecto.Changeset

  def tag, do: "room:create:reply"

  # inbound data.
  def changeset(initializer \\ %__MODULE__{}, data) do
    initializer
    |> cast(data, [:name, :description, :isPrivate, :userIdsToInvite, :autoSpeaker])
  end
end

defmodule Broth.Message.Room.Create do
  use Broth.Message.Call,
    reply: __MODULE__,
    operation: "room:create:reply"

  @derive {Jason.Encoder, only: [:id, :creatorId, :name, :description, :isPrivate]}

  @primary_key {:id, :binary_id, []}
  schema "rooms" do
    field :creatorId, :binary_id
    field :name, :string
    field :description, :string
    field :isPrivate, :boolean, default: false
    field :userIdsToInvite, {:array, :binary_id}, virtual: true
  end

  import Ecto.Changeset

  def tag, do: "room:create:reply"

  # inbound data.
  def changeset(data, _state) when not is_struct(data) do
    %__MODULE__{}
    |> cast(data, [:name, :description, :isPrivate, :userIdsToInvite])
  end

  def changeset(original_message, data) do
    payload = %__MODULE__{}
    |> cast(data, [:id, :creatorId, :name, :description, :isPrivate])
    |> apply_action!(:validate)

    original_message
    |> change
    |> put_change(:payload, payload)
  end

end

defmodule Broth.Message.Chat.Delete do
  use Broth.Message.Cast

  @derive {Jason.Encoder, only: [:messageId, :userId, :deleterId]}
  @primary_key false
  embedded_schema do
    field(:messageId, :binary_id)

    # NB: the userId is the owner of the message.  This may not necessarily be
    # the PID of the websocket, since a mod or owner of a room should be able
    # to delete other people's messages.  It's the responsibility of the FE
    # to make sure both the messageId and the userId match up correctly, or
    # else deletion authority could be spoofed.

    field(:userId, :binary_id)
    field(:deleterId, :binary_id)
  end

  alias Kousa.Utils.UUID

  def initialize(state) do
    %__MODULE__{deleterId: state.user.id}
  end

  def changeset(initializer \\ %__MODULE__{}, data) do
    initializer
    |> cast(data, [:messageId, :userId])
    |> validate_required([:messageId, :userId])
    |> UUID.normalize(:messageId)
    |> UUID.normalize(:userId)
  end

  def execute(changeset, state) do
    with {:ok, deletion} <- apply_action(changeset, :validate) do
      Kousa.Chat.delete_msg(deletion, by: state.user.id)
      {:noreply, state}
    end
  end
end

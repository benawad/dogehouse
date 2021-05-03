defmodule Broth.Message.Room.Ban do
  use Broth.Message.Cast

  @primary_key false
  embedded_schema do
    field(:userId, :binary_id)
    field(:shouldBanIp, :boolean, default: false)
  end

  alias Kousa.Utils.UUID

  def changeset(initializer \\ %__MODULE__{}, data) do
    initializer
    |> cast(data, [:userId, :shouldBanIp])
    |> validate_required([:userId, :shouldBanIp])
    |> UUID.normalize(:userId)
  end

  def execute(changeset, state) do
    with {:ok, %{userId: user_id, shouldBanIp: should_ban_ip}} <-
           apply_action(changeset, :validate) do
      # TODO: change to auth: format.
      Kousa.Room.block_from_room(state.user.id, user_id, should_ban_ip)
      {:noreply, state}
    end
  end
end

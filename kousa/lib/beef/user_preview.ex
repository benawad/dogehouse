defmodule Beef.UserPreview do
  use Ecto.Schema

  @derive {Poison.Encoder, only: [:id, :displayName, :numFollowers, :canSpeakForRoomId]}
  @primary_key false
  embedded_schema do
    field(:id, :binary_id)
    field(:displayName, :string)
    field(:numFollowers, :integer)
    field(:canSpeakForRoomId, :string)
  end
end

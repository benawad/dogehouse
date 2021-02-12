defmodule Beef.UserPreview do
  use Ecto.Schema

  @derive {Poison.Encoder, only: [:id, :displayName, :numFollowers]}
  @primary_key false
  embedded_schema do
    field(:id, :binary_id)
    field(:displayName, :string)
    field(:numFollowers, :integer)
  end
end

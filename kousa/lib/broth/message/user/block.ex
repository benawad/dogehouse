defmodule Broth.Message.User.Block do
  use Broth.Message

  @primary_key false
  embedded_schema do
    field(:userId, :binary_id)
  end

  def changeset(changeset, data) do
    changeset
    |> cast(data, [:userId])
    |> validate_required([:userId])
  end

  defmodule Reply do
    # TODO: make the reply be a schema that returns the entire user
    # database object

    use Broth.Message

    @derive {Jason.Encoder, only: [:blocked, :error]}

    @primary_key false
    embedded_schema do
      field :blocked, {:array, :binary_id}
      # field is nil when there is no error.
      field :error, :string
    end
  end
end

defmodule Broth.Message.User.Block do
  use Ecto.Schema

  @primary_key false
  embedded_schema do
    field(:userId, :binary_id)
  end

  import Ecto.Changeset

  def changeset(changeset, data) do
    changeset
    |> cast(data, [:userId])
    |> validate_required([:userId])
  end

  defmodule Reply do
    # TODO: make the reply be a schema that returns the entire user
    # database object

    use Ecto.Schema

    @derive {Jason.Encoder, only: [:blocked, :error]}

    Module.register_attribute(__MODULE__, :reply_operation, persist: true)
    @reply_operation "user:block_reply"

    @primary_key false
    embedded_schema do
      field :blocked, {:array, :binary_id}
      # field is nil when there is no error.
      field :error, :string
    end
  end
end

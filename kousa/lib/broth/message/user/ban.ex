defmodule Broth.Message.User.Ban do
  use Broth.Message

  @primary_key false
  embedded_schema do
    field(:userId, :binary_id)
    field(:reason, :string)
  end

  import Ecto.Changeset

  def changeset(changeset, data) do
    changeset
    |> cast(data, [:userId, :reason])
    |> validate_required([:userId, :reason])
  end

  defmodule Reply do
    use Broth.Message

    @derive {Jason.Encoder, only: [:error, :worked]}

    Module.register_attribute(__MODULE__, :reply_operation, persist: true)
    @reply_operation "ban_done"

    @primary_key false
    embedded_schema do
      # field is nil when there is no error.
      field :error, :string
      # to be deprecated
      field :worked, :boolean
    end
  end
end

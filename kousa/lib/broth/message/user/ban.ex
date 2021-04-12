defmodule Broth.Message.User.Ban do
  use Broth.Message.Call

  @primary_key false
  embedded_schema do
    field(:userId, :binary_id)
    field(:reason, :string)
  end

  import Ecto.Changeset

  def changeset(data, _state) do
    %__MODULE__{}
    |> cast(data, [:userId, :reason])
    |> validate_required([:userId, :reason])
  end

  defmodule Reply do
    use Broth.Message.Push

    @derive {Jason.Encoder, only: [:error]}

    @primary_key false
    embedded_schema do
      # field is nil when there is no error.
      field :error, :string
    end

    def tag, do: "user:ban:reply"

    def changeset(original_message, data) do
      payload = %__MODULE__{}
      |> cast(data, [:error])
      |> apply_action!(:validate)

      original_message
      |> change
      |> put_change(:payload, payload)
    end
  end
end

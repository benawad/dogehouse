defmodule Broth.Message.User.SetStaff do
  use Broth.Message.Call

  @primary_key false
  embedded_schema do
    field(:username, :string)
    field(:staff, :boolean)
    field(:contributions, :integer)
  end

  def changeset(initializer \\ %__MODULE__{}, data) do
    initializer
    |> cast(data, [:username, :staff, :contributions])
    |> validate_required([:username, :staff, :contributions])
  end

  defmodule Reply do
    use Broth.Message.Push

    @derive {Jason.Encoder, only: []}

    @primary_key false
    embedded_schema do
    end
  end

  def execute(changeset, state) do
    with {:ok, request} <- apply_action(changeset, :validate),
         :ok <-
           Kousa.User.set_staff_and_contributions(
             request.username,
             request.staff,
             request.contributions,
             admin_id: state.user.id
           ) do
      {:reply, %Reply{}, state}
    end
  end
end

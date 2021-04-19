defmodule Broth.Message.Misc.Search do
  use Broth.Message.Call

  @primary_key false
  embedded_schema do
    field(:query, :string)
  end

  @impl true
  def changeset(initializer \\ %__MODULE__{}, data) do
    initializer
    |> cast(data, [:query])
    |> validate_required([:query])
    |> validate_length(:query, min: 3, max: 100)
  end

  defmodule SearchItem do
    use Ecto.Schema

    @derive {Jason.Encoder, only: ~w(
        id
        username
        displayName
        avatarUrl
        bio
        name
        description
        isPrivate
      )a}

    # my attempt at a schema for the union: Array<User | Room>
    @primary_key false
    embedded_schema do
      # user
      field(:username, :string)
      field(:displayName, :string)
      field(:avatarUrl, :string)
      field(:bio, :string, default: "")
      field(:currentRoomId, :binary_id)
      # room
      field(:name, :string)
      field(:description, :string)
      field(:isPrivate, :boolean)
    end
  end

  defmodule Reply do
    use Broth.Message.Push

    @derive {Jason.Encoder, only: ~w(
        items
        nextCursor
      )a}

    @primary_key false
    embedded_schema do
      embeds_many(:items, SearchItem)
      field(:nextCursor, :integer)
    end

    def tag, do: "misc:search:reply"
  end

  alias Kousa.Search

  @impl true
  def execute(changeset, state) do
    case apply_action(changeset, :validate) do
      {:ok, %{query: query}} ->
        {:reply, %Reply{items: Search.search(query), nextCursor: nil}, state}

      error ->
        error
    end
  end
end

defmodule Broth.Message.Misc.Search do
  use Broth.Message.Call

  @primary_key false
  embedded_schema do
    field(:query, :string)
    # not used currently, but will be used in the future:
    field(:cursor, :integer)
    field(:limit, :integer)
  end

  @impl true
  def changeset(initializer \\ %__MODULE__{}, data) do
    initializer
    |> cast(data, [:query])
    |> validate_required([:query])
    |> validate_length(:query, min: 3, max: 100)
  end

  defmodule Reply do
    use Broth.Message.Push

    @derive {Jason.Encoder, only: ~w(
        items
        data
        nextCursor
      )a}

    @primary_key false
    embedded_schema do
      # the types of this is Room | User.
      # currently not enforced, but once we have real DisplayRoom and
      # DisplayUser schemas we'll make sure Search.search outputs those.
      field(:items, {:array, :map})
      field(:data, {:array, :map})
      field(:nextCursor, :integer)
    end
  end

  alias Kousa.Search

  @impl true
  def execute(changeset, state) do
    case apply_action(changeset, :validate) do
      {:ok, %{query: query}} ->
        {:reply,
         %Reply{items: Search.search(query), data: Search.search_new(query), nextCursor: nil},
         state}

      error ->
        error
    end
  end
end

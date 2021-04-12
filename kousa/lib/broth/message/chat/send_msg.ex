defmodule Broth.Message.Chat.SendMsg do
  use Broth.Message.Cast

  alias Broth.Message.Types.ChatToken

  @message_character_limit Application.compile_env!(:kousa, :message_character_limit)

  @primary_key false
  embedded_schema do
    embeds_many(:tokens, ChatToken)
    field(:whisperedTo, {:array, :binary_id})
  end

  import Ecto.Changeset

  def changeset(initializer \\ %__MODULE__{}, data) do
    initializer
    |> cast(data, [:whisperedTo])
    |> default_whispered_to
    |> put_tokens(data["tokens"])
    |> validate_whispered_to
  end

  defp default_whispered_to(changeset) do
    if get_field(changeset, :whisperedTo) do
      changeset
    else
      put_change(changeset, :whisperedTo, [])
    end
  end

  def put_tokens(changeset, []) do
    add_error(changeset, :tokens, "must not be empty")
  end

  def put_tokens(changeset, tokens) when is_list(tokens) do
    {embedded_tokens, _} = Enum.map_reduce(tokens, 0, &apply_changeset_accumulate_length/2)

    put_embed(changeset, :tokens, embedded_tokens)
  rescue
    _ in Ecto.CastError ->
      add_error(changeset, :tokens, "is invalid")
  catch
    errors ->
      %{changeset | errors: errors ++ changeset.errors, valid?: false}
  end

  def put_tokens(changeset, _invalid_tokens) do
    add_error(changeset, :tokens, "is invalid")
  end

  defp apply_changeset_accumulate_length(token, length) do
    changeset = ChatToken.changeset(%ChatToken{}, token)
    new_length = length + text_size(changeset)

    case {changeset.valid?, new_length <= @message_character_limit} do
      {false, _} ->
        throw(changeset.errors)

      {true, false} ->
        throw(tokens: {"combined length too long", []})

      {true, true} ->
        :ok
    end

    {changeset, new_length}
  end

  defp text_size(changeset) do
    changeset
    |> get_field(:value)
    |> :erlang.byte_size()
  end

  alias Kousa.Utils.UUID

  def validate_whispered_to(changeset) do
    if whisper_target = get_field(changeset, :whisperedTo) do
      normalized_uuids =
        Enum.map(whisper_target, fn target ->
          case UUID.normalize(target) do
            {:ok, nil} ->
              throw(:format_error)

            {:ok, normalized} ->
              normalized

            _ ->
              throw(:format_error)
          end
        end)

      put_change(changeset, :whisperedTo, normalized_uuids)
    else
      changeset
    end
  catch
    :format_error -> add_error(changeset, :whisperedTo, "is invalid")
  end

  def execute(%{tokens: tokens, whisperedTo: whisperedTo}, state) do
    Kousa.RoomChat.send_msg(
      state.user_id,
      tokens,
      whisperedTo
    )

    {:ok, state}
  end
end

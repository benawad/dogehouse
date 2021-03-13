defmodule Kousa.BL.RoomChat do
  alias Kousa.RegUtils
  alias Kousa.Gen
  alias Beef.Rooms

  @message_character_limit 512

  @spec send_msg(String.t(), list(map), list(String.t())) :: any
  def send_msg(user_id, tokens, whispered_to) do
    tokens = validate_tokens(tokens)

    # NB: length(list) is O(N) so use a match for stuff like this
    if length(tokens) > 0 do
      case Beef.Users.get_current_room_id(user_id) do
        nil ->
          nil

        current_room_id ->
          with {avatar_url, display_name} <-
                 Gen.UserSession.send_call!(user_id, {:get_info_for_msg}) do
            RegUtils.lookup_and_cast(
              Gen.RoomChat,
              current_room_id,
              {:new_msg, user_id,
               %{
                 id: Ecto.UUID.generate(),
                 avatarUrl: avatar_url,
                 displayName: display_name,
                 userId: user_id,
                 tokens: tokens,
                 sentAt: DateTime.utc_now(),
                 isWhisper: whispered_to != []
               }, whispered_to}
            )
          end
      end
    end
  end

  defp validate_tokens(tokens) when is_list(tokens) do
    if Enum.reduce_while(tokens, 0, &count_message_characters/2) <= @message_character_limit do
      tokens
      |> Enum.reduce([], &validate_tokens/2)
      |> Enum.reverse()
    else
      []
    end
  end

  defp validate_tokens(_), do: []

  defp validate_tokens(token, acc) do
    case validate_token(token) do
      {:ok, token} -> [token | acc]
      _ -> acc
    end
  end

  defp count_message_characters(%{"v" => v}, acc) do
    if acc <= @message_character_limit, do: {:cont, String.length(v) + acc}, else: {:halt, acc}
  end

  defp validate_token(token = %{"t" => type, "v" => _}) when type in ["text", "mention"],
    do: {:ok, token}

  defp validate_token(token = %{"t" => "link", "v" => link}) do
    link
    |> URI.parse()
    |> valid_url?()
    |> case do
      true -> {:ok, token}
      _ -> :invalid
    end
  end

  defp validate_token(_), do: :invalid

  defp valid_url?(%URI{host: host, scheme: scheme}) when is_binary(host) and is_binary(scheme),
    do: true

  defp valid_url?(_), do: false

  def ban_user(user_id, user_id_to_ban) do
    case Rooms.get_room_status(user_id) do
      {:creator, room} ->
        if room.creatorId != user_id_to_ban do
          RegUtils.lookup_and_cast(Gen.RoomChat, room.id, {:ban_user, user_id_to_ban})
        end

      {:mod, room} ->
        if room.creatorId != user_id_to_ban do
          RegUtils.lookup_and_cast(Gen.RoomChat, room.id, {:ban_user, user_id_to_ban})
        end

      _ ->
        nil
    end

    :ok
  end

  # Delete room chat messages
  def delete_message(deleter_id, message_id, user_id) do
    case Rooms.get_room_status(deleter_id) do
      {:creator, room} ->
        RegUtils.lookup_and_cast(
          Gen.RoomChat,
          room.id,
          {:message_deleted, deleter_id, message_id}
        )

      # Mods can delete other mod' messages
      {:mod, room} ->
        if user_id != room.creatorId do
          RegUtils.lookup_and_cast(
            Gen.RoomChat,
            room.id,
            {:message_deleted, deleter_id, message_id}
          )
        end

      {:listener, room} ->
        if user_id == deleter_id do
          RegUtils.lookup_and_cast(
            Gen.RoomChat,
            room.id,
            {:message_deleted, deleter_id, message_id}
          )
        end

      _ ->
        nil
    end
  end
end

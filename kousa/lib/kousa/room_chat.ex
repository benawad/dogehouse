defmodule Kousa.RoomChat do
  alias Beef.Rooms

  @message_character_limit 512

  @spec send_msg(String.t(), list(map), list(String.t())) :: any
  def send_msg(user_id, tokens, whispered_to) do
    tokens = validate_tokens(tokens)

    # NB: length(list) is O(N) so use a match for stuff like this
    if length(tokens) > 0 and is_list(whispered_to) and Enum.all?(whispered_to, &is_bitstring(&1)) do
      case Beef.Users.get_current_room_id(user_id) do
        nil ->
          nil

        current_room_id ->
          with {avatar_url, display_name, username} <-
                 Onion.UserSession.get_info_for_msg(user_id) do
            Onion.RoomChat.new_msg(
              current_room_id,
              user_id,
              %{
                id: Ecto.UUID.generate(),
                avatarUrl: avatar_url,
                displayName: display_name,
                username: username,
                userId: user_id,
                tokens: tokens,
                sentAt: DateTime.utc_now(),
                isWhisper: whispered_to != []
              },
              whispered_to
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

  defp validate_token(token = %{"t" => type, "v" => _})
       when type in ["text", "mention", "block", "emote"],
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

  @ban_roles [:creator, :mod]

  def ban_user(user_id, user_id_to_ban) do
    room =
      case Rooms.get_room_status(user_id) do
        {role, room = %{creatorId: creator_id}}
        when role in @ban_roles and creator_id != user_id_to_ban ->
          room

        _ ->
          nil
      end

    if room do
      Onion.RoomChat.ban_user(room.id, user_id_to_ban)
      :ok
    else
      {:error, "#{user_id} not authorized to ban #{user_id_to_ban}"}
    end
  end

  # Delete room chat messages
  def delete_message(deleter_id, message_id, user_id) do
    room =
      case Rooms.get_room_status(deleter_id) do
        {:creator, room} ->
          room

        # Mods can delete other mod' messages
        {:mod, room = %{creatorId: creator_id}}
        when user_id != creator_id ->
          room

        {:listener, room} when user_id == deleter_id ->
          room

        _ ->
          nil
      end

    if room do
      Onion.RoomChat.message_deleted(room.id, deleter_id, message_id)
      :ok
    else
      {:error, "#{user_id} not authorized to delete the selected message"}
    end
  end
end

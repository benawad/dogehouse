defmodule Broth.Translator.V0_1_0 do
  @moduledoc """
  Version 0.1.0 -> 0.2.0 translation
  """

  import Kousa.Utils.Version, only: [sigil_v: 2]

  ############################################################################
  ## INBOUND MESSAGES

  @operator_translations %{
    "send_room_chat_msg" => "chat:send_msg",
    "invite_to_room" => "room:invite",
    "get_my_following" => "user:get_following",
    "get_top_public_rooms" => "room:get_top",
    "get_current_room_users" => "room:get_users",
    "mute" => "user:mute",
    "delete_room_chat_message" => "chat:delete_msg",
    "auth" => "auth:request",
    "leave_room" => "room:leave",
    "create_room" => "room:create",
    "edit_profile" => "user:update",
    "ban" => "user:ban",
    "set_listener" => "room:set_role",
    "add_speaker" => "room:set_role",
    "change_mod_status" => "room:set_auth",
    "change_room_creator" => "room:set_auth",
    "make_room_public" => "room:update",
    "edit_room" => "room:update",
    "fetch_invite_list" => "room:get_invite_list",
    "get_user_profile" => "user:get_info",
    "ask_to_speak" => "room:set_role",
    "ban_from_room_chat" => "chat:ban",
    "block_from_room" => "room:ban",
    # follow needs to arbitrate if it becomes follow or unfollow.
    "follow" => nil,
    "follow_info" => "user:get_relationship",
    # these are special cases:
    "block_user_and_from_room" => "block_user_and_from_room",
    "fetch_follow_list" => "fetch_follow_list",
    "join_room_and_get_info" => "join_room_and_get_info",
    "audio_autoplay_error" => "audio_autoplay_error"
  }

  @operators Map.keys(@operator_translations)

  defguard translates(message) when :erlang.map_get("op", message) in @operators

  def translate(message = %{"op" => operator}) do
    message
    |> translate_operation
    |> translate_body(operator)
    |> add_ref(operator)
    |> add_version
  end

  def translate_operation(message = %{"op" => operator}) do
    %{message | "op" => @operator_translations[operator]}
  end

  def translate_body(message, "edit_profile") do
    %{message | "d" => get_in(message, ["d", "data"])}
  end

  def translate_body(message, "create_room") do
    is_private = get_in(message, ["d", "privacy"]) == "private"
    put_in(message, ["d", "isPrivate"], is_private)
  end

  def translate_body(message, "ban") do
    username = get_in(message, ["d", "username"])
    reason = get_in(message, ["d", "reason"])

    message
    |> put_in(["d", "userId"], Beef.Users.get_by_username(username).id)
    |> put_in(["d", "reason"], reason)
  end

  def translate_body(message, "set_listener") do
    put_in(message, ["d", "role"], "listener")
  end

  def translate_body(message, "add_speaker") do
    put_in(message, ["d", "role"], "speaker")
  end

  def translate_body(message, "change_mod_status") do
    role = if get_in(message, ["d","value"]), do: "mod", else: "user"
    put_in(message, ["d", "level"], role)
  end

  def translate_body(message, "change_room_creator") do
    put_in(message, ["d", "level"], "owner")
  end

  def translate_body(message, "make_room_public") do
    name = get_in(message, ["d", "newName"])
    is_private = get_in(message, ["d", "isPrivate"]) || false

    message
    |> put_in(["d", "name"], name)
    |> put_in(["d", "isPrivate"], is_private)
  end

  def translate_body(message, "edit_room") do
    is_private = get_in(message, ["d", "privacy"]) == "private"
    put_in(message, ["d", "isPrivate"], is_private)
  end

  def translate_body(message, "ask_to_speak") do
    put_in(message, ["d", "role"], "raised_hand")
  end

  def translate_body(message, "follow") do
    # this one has to also alter the operation.
    operation = if get_in(message, ["d", "value"]), do: "user:follow", else: "user:unfollow"
    %{message | "op" => operation}
  end

  def translate_body(message, _op), do: message

  # these casts need to be instrumented with fetchId in order to be treated
  # as a cast.
  @casts_to_calls ~w(auth leave_room ban fetch_invite_list make_room_public)

  def add_ref(message, op) when op in @casts_to_calls do
    Map.put(message, "fetchId", UUID.uuid4())
  end

  def add_ref(message, _op), do: message

  def add_version(message), do: Map.put(message, "version", ~v(0.1.0))

  ############################################################################
  ## OUTBOUND MESSAGES
end

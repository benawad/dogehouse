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
    "get_blocked_from_room_users" => "room:get_banned_users",
    "mute" => "room:mute",
    "deafen" => "room:deafen",
    "delete_room_chat_message" => "chat:delete",
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
    "get_invite_list" => "room:get_invite_list",
    "get_user_profile" => "user:get_info",
    "ask_to_speak" => "room:set_role",
    "ban_from_room_chat" => "chat:ban",
    "block_from_room" => "room:ban",
    "follow_info" => "user:get_relationship",
    "speaking_change" => "room:set_active_speaker",
    "get_my_scheduled_rooms_about_to_start" => "room:get_scheduled",
    "get_scheduled_rooms" => "room:get_scheduled",
    "delete_scheduled_room" => "room:delete_scheduled",
    "edit_scheduled_room" => "room:update_scheduled",
    "schedule_room" => "room:create_scheduled",
    "create_room_from_scheduled_room" => "room:create",
    "unban_from_room" => "room:unban",
    "search" => "misc:search",
    "unban_from_room_chat" => "chat:unban",
    # follow needs to arbitrate if it becomes follow or unfollow.
    "follow" => nil,
    # get_follow_list needs to arbitrate if its followers or following.
    "get_follow_list" => nil,
    # these are special cases:
    "block_user_and_from_room" => "block_user_and_from_room",
    "fetch_follow_list" => "fetch_follow_list",
    "join_room_and_get_info" => "join_room_and_get_info"
  }

  @operators Map.keys(@operator_translations)

  defguard translates(message) when :erlang.map_get("op", message) in @operators

  def translate_inbound(message = %{"op" => operator}) do
    message
    |> translate_operation
    |> translate_in_body(operator)
    |> add_in_ref(operator)
    |> add_version
  end

  def translate_operation(message = %{"op" => operator}) do
    put_in(message, ["op"], @operator_translations[operator])
  end

  def translate_in_body(message, "edit_profile") do
    put_in(message, ["d"], get_in(message, ["d", "data"]))
  end

  def translate_in_body(message, "get_user_profile") do
    put_in(message, ["d", "userIdOrUsername"], get_in(message, ["d", "userId"]))
  end

  def translate_in_body(message, "create_room_from_scheduled_room") do
    put_in(message, ["d", "scheduledRoomId"], get_in(message, ["d", "id"]))
  end

  def translate_in_body(message, "create_room") do
    is_private = get_in(message, ["d", "privacy"]) == "private"
    put_in(message, ["d", "isPrivate"], is_private)
  end

  def translate_in_body(message, "ban") do
    username = get_in(message, ["d", "username"])
    reason = get_in(message, ["d", "reason"])

    message
    |> put_in(["d", "userId"], Beef.Users.get_by_username(username).id)
    |> put_in(["d", "reason"], reason)
  end

  def translate_in_body(message, "set_listener") do
    put_in(message, ["d", "role"], "listener")
  end

  def translate_in_body(message, "add_speaker") do
    put_in(message, ["d", "role"], "speaker")
  end

  def translate_in_body(message, "change_mod_status") do
    role = if get_in(message, ["d", "value"]), do: "mod", else: "user"
    put_in(message, ["d", "level"], role)
  end

  def translate_in_body(message, "change_room_creator") do
    put_in(message, ["d", "level"], "owner")
  end

  def translate_in_body(message, "make_room_public") do
    name = get_in(message, ["d", "newName"])
    is_private = get_in(message, ["d", "isPrivate"]) || false

    message
    |> put_in(["d", "name"], name)
    |> put_in(["d", "isPrivate"], is_private)
  end

  def translate_in_body(message, "edit_room") do
    is_private = get_in(message, ["d", "privacy"]) == "private"
    put_in(message, ["d", "isPrivate"], is_private)
  end

  def translate_in_body(message, "ask_to_speak") do
    put_in(message, ["d", "role"], "raised_hand")
  end

  def translate_in_body(message, "follow") do
    # this one has to also alter the operation.
    operation = if get_in(message, ["d", "value"]), do: "user:follow", else: "user:unfollow"
    put_in(message, ["op"], operation)
  end

  def translate_in_body(message, "get_follow_list") do
    # this one has to also alter the operation.
    operation =
      if get_in(message, ["d", "isFollowing"]),
        do: "user:get_following",
        else: "user:get_followers"

    put_in(message, ["op"], operation)
  end

  def translate_in_body(message, "speaking_change") do
    active? = get_in(message, ["d", "value"])
    put_in(message, ["d"], %{"active" => active?})
  end

  def translate_in_body(message, "mute") do
    active? = get_in(message, ["d", "value"])
    put_in(message, ["d"], %{"muted" => active?})
  end

  def translate_in_body(message, "deafen") do
    active? = get_in(message, ["d", "value"])
    put_in(message, ["d"], %{"deafened" => active?})
  end

  def translate_in_body(message, "get_my_scheduled_rooms_about_to_start") do
    message
    |> put_in(["d", "range"], "upcoming")
    |> put_in(["d", "userId"], "self")
  end

  def translate_in_body(message, "get_scheduled_rooms") do
    if get_in(message, ["d", "getOnlyMyScheduledRooms"]) do
      put_in(message, ["d", "userId"], "self")
    else
      message
    end
  end

  def translate_in_body(message, "delete_scheduled_room") do
    room_id = get_in(message, ["d", "id"])
    put_in(message, ["d", "roomId"], room_id)
  end

  def translate_in_body(message, "edit_scheduled_room") do
    room_id = get_in(message, ["d", "id"])

    room_data =
      message
      |> get_in(["d", "data"])
      |> Kernel.||(%{})
      |> Map.put("id", room_id)

    Map.put(message, "d", room_data)
  end

  def translate_in_body(message, _op), do: message

  # these casts need to be instrumented with fetchId in order to be treated
  # as a cast.
  @casts_to_calls ~w(auth leave_room ban make_room_public mute deafen)

  def add_in_ref(message, op) when op in @casts_to_calls do
    Map.put(message, "fetchId", UUID.uuid4())
  end

  def add_in_ref(message, _op), do: message

  def add_version(message), do: Map.put(message, "version", ~v(0.1.0))

  ############################################################################
  ## OUTBOUND MESSAGES

  def translate_outbound(message, original) do
    %{op: "fetch_done", d: message.p}
    |> add_out_ref(message)
    |> add_out_err(message)
    |> translate_out_body(original.inbound_operator || message.op)
  end

  defp add_out_ref(message, %{ref: ref}), do: Map.put(message, :fetchId, ref)
  defp add_out_ref(message, _), do: message

  defp add_out_err(message, %{e: err}), do: Map.put(message, :e, err)
  defp add_out_err(message, _), do: message

  def translate_out_body(message, "auth:request") do
    %{message | op: "auth-good", d: %{user: message.d}}
  end

  def translate_out_body(message, "user:ban") do
    %{message | op: "ban_done", d: %{worked: !message[:e]}}
  end

  def translate_out_body(message, "room:create") do
    %{message | d: %{room: message.d}}
  end

  def translate_out_body(message = %{e: errors}, "user:update") do
    %{message | d: %{isUsernameTaken: "has already been taken" in Map.values(errors)}}
  end

  def translate_out_body(message, "user:get_relationship") do
    new_data =
      case message.d.relationship do
        nil -> %{followsYou: false, youAreFollowing: false}
        :follower -> %{followsYou: true, youAreFollowing: false}
        :following -> %{followsYou: false, youAreFollowing: true}
        :mutual -> %{followsYou: true, youAreFollowing: true}
      end

    %{message | d: new_data}
  end

  def translate_out_body(message, "room:create_scheduled") do
    %{message | d: %{scheduledRoom: message.d}}
  end

  def translate_out_body(message, "room:update") do
    %{message | d: !Map.get(message, :e)}
  end

  def translate_out_body(message, "room:get_invite_list") do
    data = %{users: message.d.invites, nextCursor: message.d.nextCursor}
    %{message | d: data}
  end

  def translate_out_body(message, "user:get_following") do
    data = %{users: message.d.following, nextCursor: message.d.nextCursor}
    %{message | d: data}
  end

  def translate_out_body(message, "user:get_followers") do
    data = %{users: message.d.followers, nextCursor: message.d.nextCursor}
    %{message | d: data}
  end

  def translate_out_body(message, "room:leave") do
    %{message | op: "you_left_room"}
  end

  def translate_out_body(message, "room:get_scheduled") do
    rooms = message.d.rooms
    %{message | d: %{"scheduledRooms" => rooms}}
  end

  #################################################################
  # autogenous messages

  def translate_out_body(message, "chat:send") do
    user_info =
      message.d.from
      |> Beef.Users.get_by_id()
      |> Map.take([:avatarUrl, :displayName, :username])

    chat_msg =
      message.d
      |> Map.take([:id, :isWhisper, :sentAt, :tokens])
      |> Map.merge(user_info)
      |> Map.put(:userId, message.d.from)

    %{
      message
      | d: %{
          "msg" => chat_msg,
          "userId" => message.d.from
        },
        op: "new_chat_msg"
    }
  end

  def translate_out_body(message, "chat:delete") do
    %{op: "message_deleted", d: message.d}
  end

  #################################################################
  # pure outbound messages

  def translate_out_body(message, _), do: message
end

defmodule Broth.Translator do
  import Kousa.Utils.Version

  @operators_0_1_0 ~w(
    send_room_chat_msg
    invite_to_room
    auth
    leave_room
    create_room
    edit_profile
    ban
    set_listener
    add_speaker
    change_mod_status
    change_room_creator
    make_room_public
    follow_info
    edit_room
    fetch_invite_list
    get_my_following
    get_top_public_rooms
    get_current_room_users
    get_user_profile
    ask_to_speak
    mute
    ban_from_room_chat
    block_from_room
    follow
    delete_room_chat_message
  )

  def convert_inbound(command = %{"op" => op}) when op in @operators_0_1_0 do
    command
    |> Map.merge(%{"v" => ~v(0.1.0), "inbound_operator" => op})
    |> convert_inbound_0_1_0
  end

  # requires an API version string
  def convert_inbound(command), do: command

  @translations %{
    "send_room_chat_msg" => "chat:send_msg",
    "invite_to_room" => "room:invite",
    "get_my_following" => "user:get_following",
    "get_top_public_rooms" => "room:get_top",
    "get_current_room_users" => "room:get_users",
    "mute" => "user:mute",
    "delete_room_chat_message" => "chat:delete_msg"
  }
  @translation_keys Map.keys(@translations)

  def convert_inbound_0_1_0(command = %{"op" => operation}) when operation in @translation_keys do
    Map.put(command, "op", @translations[operation])
  end

  @calls %{
    "auth" => "auth:request",
    "leave_room" => "room:leave"
  }
  @call_keys Map.keys(@calls)

  # these forms are converted from casts to .
  def convert_inbound_0_1_0(command = %{"op" => operation}) when operation in @call_keys do
    Map.merge(command, %{"op" => @calls[operation], "ref" => UUID.uuid4()})
  end

  def convert_inbound_0_1_0(command = %{"op" => "create_room", "d" => d}) do
    command
    |> Map.put("op", "room:create")
    |> put_in(["d", "isPrivate"], d["privacy"] == "private")
  end

  def convert_inbound_0_1_0(command = %{"op" => "edit_profile", "d" => %{"data" => data}}) do
    Map.merge(command, %{
      "op" => "user:update",
      "d" => data
    })
  end

  def convert_inbound_0_1_0(command = %{"op" => "ban", "d" => d = %{"username" => _}}) do
    userId = Beef.Users.get_by_username(d["username"]).id

    Map.merge(command, %{
      "op" => "user:ban",
      "d" => %{"id" => userId, "reason" => d["reason"]},
      "ref" => UUID.uuid4()
    })
  end

  def convert_inbound_0_1_0(command = %{"op" => "set_listener", "d" => d}) do
    Map.merge(
      command,
      %{
        "op" => "room:set_role",
        "d" => Map.put(d, "role", "listener")
      }
    )
  end

  def convert_inbound_0_1_0(command = %{"op" => "add_speaker", "d" => d}) do
    Map.merge(
      command,
      %{
        "op" => "room:set_role",
        "d" => Map.merge(d, %{"role" => "speaker", "id" => d["userId"]})
      }
    )
  end

  def convert_inbound_0_1_0(command = %{"op" => "change_mod_status", "d" => d}) do
    role = if d["value"], do: "mod", else: "user"

    Map.merge(command, %{
      "op" => "room:set_auth",
      "d" => %{"id" => d["userId"], "level" => role}
    })
  end

  def convert_inbound_0_1_0(command = %{"op" => "change_room_creator", "d" => d}) do
    Map.merge(
      command,
      %{
        "op" => "room:set_auth",
        "d" => %{"id" => d["userId"], "level" => "owner"}
      }
    )
  end

  def convert_inbound_0_1_0(command = %{"op" => "make_room_public", "d" => d}) do
    Map.merge(
      command,
      %{
        "op" => "room:update",
        "d" => %{"name" => d["newName"], "isPrivate" => Map.get(d, "isPrivate", false)},
        "fetchId" => UUID.uuid4()
      }
    )
  end

  def convert_inbound_0_1_0(command = %{"op" => "edit_room", "d" => d}) do
    %{command | "op" => "room:update", "d" => Map.put(d, "isPrivate", d["privacy"] == "private")}
  end

  def convert_inbound_0_1_0(command = %{"op" => "fetch_invite_list"}) do
    Map.merge(command, %{
      "op" => "room:get_invite_list",
      "ref" => UUID.uuid4()
    })
  end

  def convert_inbound_0_1_0(command = %{"op" => "get_user_profile", "d" => d}) do
    %{command | "op" => "user:get_info", "d" => %{"id" => d["userId"]}}
  end

  def convert_inbound_0_1_0(command = %{"op" => "ask_to_speak", "d" => d}) do
    Map.merge(
      command,
      %{
        "op" => "room:set_role",
        "d" => Map.merge(d, %{"role" => "raised_hand"})
      }
    )
  end

  def convert_inbound_0_1_0(command = %{"op" => "ban_from_room_chat", "d" => d}) do
    Map.merge(
      command,
      %{
        "op" => "chat:ban",
        "d" => Map.merge(d, %{"id" => d["userId"]})
      }
    )
  end

  def convert_inbound_0_1_0(command = %{"op" => "block_from_room", "d" => d}) do
    Map.merge(
      command,
      %{
        "op" => "room:ban",
        "d" => Map.merge(d, %{"id" => d["userId"]})
      }
    )
  end

  def convert_inbound_0_1_0(command = %{"op" => "follow", "d" => d}) do
    operation = if d["value"], do: "user:follow", else: "user:unfollow"

    Map.merge(
      command,
      %{
        "op" => operation,
        "d" => Map.merge(d, %{"id" => d["userId"]})
      }
    )
  end

  def convert_inbound_0_1_0(command = %{"op" => "follow_info", "d" => d}) do
    Map.merge(
      command,
      %{
        "op" => "user:get_relationship",
        "d" => Map.merge(d, %{"id" => d["userId"]})
      }
    )
  end

  # let it pass, and return a general error.
  def convert_inbound_0_1_0(command), do: command

  #############################################################################
  ## OUTBOUND CONVERSION

  def convert_outbound(map, original = %{version: ~v(0.1.0)}) do
    %{op: "fetch_done", d: map.p}
    |> add_ref(map)
    |> add_err(map)
    |> convert_outbound_0_1_0(original.inbound_operator)
  end

  def convert_outbound(map, _), do: map 

  defp add_ref(map, %{ref: ref}), do: Map.put(map, :fetchId, ref)
  defp add_ref(map, _), do: map

  defp add_err(map, %{e: err}), do: Map.put(map, :e, err)
  defp add_err(map, _), do: map

  def convert_outbound_0_1_0(map, "auth:request") do
    %{map | op: "auth-good", d: %{user: %{id: map.d.id}}}
  end

  def convert_outbound_0_1_0(map, "user:ban") do
    %{map | op: "ban_done", d: %{worked: !map[:e]}}
  end

  def convert_outbound_0_1_0(map, "room:create") do
    %{map | d: %{room: map.d}}
  end

  def convert_outbound_0_1_0(map = %{e: errors}, "user:update") do
    %{map | d: %{isUsernameTaken: errors =~ "has already been taken"}}
  end

  def convert_outbound_0_1_0(map, "user:update") do
    %{map | d: %{isUsernameTaken: false}}
  end

  def convert_outbound_0_1_0(map, "user:get_relationship") do
    new_data =
      case map.d.relationship do
        nil -> %{followsYou: false, youAreFollowing: false}
        :follows -> %{followsYou: true, youAreFollowing: false}
        :following -> %{followsYou: false, youAreFollowing: true}
        :mutual -> %{followsYou: true, youAreFollowing: true}
      end

    %{map | d: new_data}
  end

  def convert_outbound_0_1_0(map, "room:update") do
    %{map | d: !Map.get(map, :e)}
  end

  def convert_outbound_0_1_0(map, "room:get_invite_list") do
    data = %{users: map.d.invites, nextCursor: map.d.nextCursor}
    %{map | op: "fetch_invite_list_done", d: data}
  end

  def convert_outbound_0_1_0(map, "user:get_following") do
    data = %{users: map.d.following, nextCursor: map.d.nextCursor}
    %{map | d: data}
  end

  def convert_outbound_0_1_0(map, "room:leave") do
    %{map | op: "you_left_room"}
  end

  # def convert_outbound_0_1_0(map, orig) do
  #  raise "foo"
  # end

  def convert_outbound_0_1_0(map, _), do: map
end

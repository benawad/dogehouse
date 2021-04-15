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
    mute
  )

  def convert_inbound(command = %{"op" => op}) when op in @operators_0_1_0 do
    command
    |> Map.merge(%{"version" => ~v(0.1.0), "inbound_operator" => op})
    |> convert_inbound_0_1_0
  end

  # requires an API version string
  def convert_inbound(command), do: command

  @translations %{
    "send_room_chat_msg" => "chat:send_msg",
    "invite_to_room" => "room:invite",
    "follow_info" => "user:get_relationship",
    "get_my_following" => "user:get_following",
    "get_top_public_rooms" => "room:get_top",
    "get_current_users" => "room:get_users",
    "mute" => "user:mute"
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
      "d" => %{"userId" => userId, "reason" => d["reason"]},
      "ref" => UUID.uuid4()
    })
  end

  def convert_inbound_0_1_0(command = %{"op" => "set_listener", "d" => d}) do
    Map.merge(
      command,
      %{
        "op" => "room:set_role",
        "p" => Map.put(d, "role", "listener")
      }
    )
  end

  def convert_inbound_0_1_0(command = %{"op" => "add_speaker", "d" => d}) do
    Map.merge(command,
    %{
      "op" => "room:set_role",
      "p" => Map.put(d, "role", "speaker")
    })
  end

  def convert_inbound_0_1_0(command = %{"op" => "change_mod_status", "d" => d}) do
    role = if d["value"], do: "mod", else: "user"

    Map.merge(command, %{
      "op" => "room:set_auth",
      "p" => Map.put(d, "level", role)
    })
  end

  def convert_inbound_0_1_0(command = %{"op" => "change_room_creator", "d" => d}) do
    Map.merge(command,
    %{
      "op" => "room:set_auth",
      "p" => Map.put(d, "level", "owner")
    })
  end

  def convert_inbound_0_1_0(command = %{"op" => "make_room_public", "d" => d}) do
    Map.merge(command,
    %{
      "op" => "room:update",
      "p" => %{"room" => d},
      "ref" => UUID.uuid4()
    })
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

  #############################################################################
  ## OUTBOUND CONVERSION

  def convert_outbound(map, original = %{version: ~v(0.1.0)}) do
    %{op: "fetch_done", d: map.p}
    |> add_ref(map)
    |> add_err(map)
    |> convert_outbound_0_1_0(map.op, original)
  end

  def convert_outbound(map, _), do: map

  defp add_ref(map, %{ref: ref}), do: Map.put(map, :fetchId, ref)
  defp add_ref(map, _), do: map

  defp add_err(map, %{errors: err}), do: Map.put(map, :errors, err)
  defp add_err(map, _), do: map

  def convert_outbound_0_1_0(map, "auth:request:reply", _) do
    %{map | op: "auth-good", d: %{user: %{id: map.d.id}}}
  end

  def convert_outbound_0_1_0(map, "user:ban:reply", _) do
    %{map | op: "ban_done", d: %{worked: !map[:error]}}
  end

  def convert_outbound_0_1_0(map, "room:create:reply", _) do
    %{map | d: %{room: map.d}}
  end

  def convert_outbound_0_1_0(map = %{errors: errors}, "user:update:reply", _) do
    %{map | d: %{isUsernameTaken: errors =~ "has already been taken"}}
  end

  def convert_outbound_0_1_0(map, "user:update:reply", _) do
    %{map | d: %{isUsernameTaken: false}}
  end

  def convert_outbound_0_1_0(map, "user:get_relationship:reply", _) do
    new_data =
      case map.d.relationship do
        nil -> %{followsYou: false, youAreFollowing: false}
        :follows -> %{followsYou: true, youAreFollowing: false}
        :following -> %{followsYou: false, youAreFollowing: true}
        :mutual -> %{followsYou: true, youAreFollowing: true}
      end

    %{map | d: new_data}
  end

  def convert_outbound_0_1_0(map, "room:update:reply", _) do
    %{map | d: !Map.get(map, :errors)}
  end

  def convert_outbound_0_1_0(map, "room:get_invite_list:reply", _) do
    data = %{users: map.d.invites, nextCursor: map.d.nextCursor}
    %{map | op: "fetch_invite_list_done", d: data}
  end

  def convert_outbound_0_1_0(map, "user:get_following:reply", _) do
    data = %{users: map.d.following, nextCursor: map.d.nextCursor}
    %{map | d: data}
  end

  def convert_outbound_0_1_0(map, _, _), do: map
end

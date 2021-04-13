defmodule Broth.Translator do
  @translations %{
    "send_room_chat_msg" => "chat:send_msg",
    "invite_to_room" => "room:invite"
  }
  @translation_keys Map.keys(@translations)

  def convert_inbound(command = %{"op" => operation}) when operation in @translation_keys do
    %{command | "op" => @translations[operation]}
  end

  @calls %{
    "auth" => "auth:request",
    "leave_room" => "room:leave"
  }
  @call_keys Map.keys(@calls)

  # these forms are converted from casts to .
  def convert_inbound(command = %{"op" => operation}) when operation in @call_keys do
    Map.merge(command, %{"op" => @calls[operation], "ref" => UUID.uuid4()})
  end

  def convert_inbound(command = %{"op" => "create_room", "d" => d}) do
    command
    |> Map.put("op", "room:create")
    |> put_in(["d", "isPrivate"], d["privacy"] == "private")
  end

  def convert_inbound(command = %{"op" => "edit_profile", "d" => %{"data" => data}}) do
    %{
      "op" => "user:update",
      "p" => data,
      "ref" => command["fetchId"]
    }
  end

  def convert_inbound(%{"op" => "ban", "d" => d = %{"username" => _}}) do
    userId = Beef.Users.get_by_username(d["username"]).id

    %{
      "op" => "user:ban",
      "p" => %{"userId" => userId, "reason" => d["reason"]},
      "ref" => UUID.uuid4()
    }
  end

  def convert_inbound(%{"op" => "set_listener", "d" => d}) do
    %{
      "op" => "room:set_role",
      "p" => Map.put(d, "role", "listener")
    }
  end

  def convert_inbound(%{"op" => "add_speaker", "d" => d}) do
    %{
      "op" => "room:set_role",
      "p" => Map.put(d, "role", "speaker")
    }
  end

  def convert_inbound(%{"op" => "change_mod_status", "d" => d}) do
    role = if d["value"], do: "mod", else: "user"

    %{
      "op" => "room:set_auth",
      "p" => Map.put(d, "level", role)
    }
  end

  def convert_inbound(%{"op" => "change_room_creator", "d" => d}) do
    %{
      "op" => "room:set_auth",
      "p" => Map.put(d, "level", "owner")
    }
  end

  def convert_inbound(%{"op" => "make_room_public", "d" => d}) do
    %{
      "op" => "room:update",
      "p" => %{"room" => d},
      "ref" => UUID.uuid4()
    }
  end

  def convert_inbound(command = %{"op" => "follow_info", "d" => d}) do
    %{ command | "op" => "user:get_relationship"}
  end

  import Kousa.Utils.Version

  def convert_inbound(command) do
    Map.put(command, "version", ~v(0.2.0))
  end

  #############################################################################
  ## OUTBOUND CONVERSION

  def convert_outbound(map, original = %{version: ~v(0.1.0)}) do
    convert_0_1_0(%{op: "fetch_done", d: map.p, fetchId: map.ref}, map.op, original)
  end

  def convert_outbound(map, _), do: map

  def convert_0_1_0(map, "auth:request:reply", _) do
    %{map | op: "auth-good", d: %{user: %{id: map.d.id}}}
  end

  def convert_0_1_0(map, "user:ban:reply", _) do
    %{map | op: "ban_done", d: %{worked: !map[:error]}}
  end

  def convert_0_1_0(map, "room:create:reply", _) do
    %{map | d: %{room: map.d}}
  end

  def convert_0_1_0(map = %{errors: errors}, "user:update:reply", _) do
    %{map | d: %{isUsernameTaken: errors =~ "has already been taken"}}
  end

  def convert_0_1_0(map, "user:update:reply", _) do
    %{map | d: %{isUsernameTaken: false}}
  end

  def convert_0_1_0(map, "user:get_relationship:reply", _) do
    new_data = case map.d.relationship do
      nil -> %{followsYou: false, youAreFollowing: false}
      :follows -> %{followsYou: true, youAreFollowing: false}
      :following -> %{followsYou: false, youAreFollowing: true}
      :mutual -> %{followsYou: true, youAreFollowing: true}
    end
    %{map | d: new_data}
  end

  def convert_0_1_0(map, _, _), do: map
end

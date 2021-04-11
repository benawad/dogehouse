defmodule Broth.Translator do

  @translations %{
    "send_room_chat_msg" => "chat:send_msg",
  }
  @translation_keys Map.keys(@translations)

  def convert_legacy(command = %{"op" => operation}) when operation in @translation_keys do
    %{command | "op" => @translations[operation]}
  end

  @calls %{
    "auth" => "auth:request",
    "leave_room" => "room:leave"
  }
  @call_keys Map.keys(@calls)

  # these forms are converted from calls to casts.
  def convert_legacy(command = %{"op" => operation}) when operation in @call_keys do
    Map.merge(command, %{"op" => @calls[operation], "ref" => UUID.uuid4()})
  end

  def convert_legacy(command = %{"op" => "create_room", "d" => d}) do
    command
    |> Map.put("op", "room:create")
    |> put_in(["d", "isPrivate"], d["privacy"] == "private")
  end

  def convert_legacy(command = %{"op" => "edit_profile", "d" => %{"data" => data}}) do
    %{
      "op" => "user:update",
      "p" => data,
      "ref" => command["fetchId"]
    }
  end

  def convert_legacy(%{"op" => "ban", "d" => d = %{"username" => _}}) do
    userId = Beef.Users.get_by_username(d["username"]).id
    %{
      "op" => "user:ban",
      "p" => %{"userId" => userId, "reason" => d["reason"]},
      "ref" => UUID.uuid4()
    }
  end

  def convert_legacy(%{"op" => "set_listener", "d" => d}) do
    %{
      "op" => "room:set_role",
      "p" => Map.put(d, "role", "listener")
    }
  end

  def convert_legacy(command) do
    command
  end
end

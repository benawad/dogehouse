defmodule Kousa.Search do
  alias Beef.Users
  alias Beef.Rooms

  def search(query) do
    case String.trim(query) do
      <<?@>> <> username -> Users.search_username(username)
      roomname -> Rooms.search_name(roomname)
    end
  end
end

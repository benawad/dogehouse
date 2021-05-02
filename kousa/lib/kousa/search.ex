defmodule Kousa.Search do
  alias Beef.Users
  alias Beef.Rooms

  # probably dont wanna get the data 3x

  def search(query) do
    case String.trim(query) do
      <<?@>> <> username -> Users.search_username(username)
      roomname -> Rooms.search_name(roomname)
    end
  end

  def search_new(query) do
    %{
      users: Users.search_username(query),
      rooms: Rooms.search_name(query)
    }
  end
end

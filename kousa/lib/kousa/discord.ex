defmodule Kousa.Discord do
  def get_avatar_url(user) do
    if is_nil(user["avatar"]),
      do: "https://cdn.discordapp.com/embed/avatars/" <> rem(user["discriminator"], 5) <> ".png",
      else: "https://cdn.discordapp.com/avatars/" <> user["id"] <> "/" <> user["avatar"] <> ".png"
  end
end

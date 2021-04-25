defmodule Beef.Access.Bots do
  import Ecto.Query

  alias Beef.Repo
  alias Beef.Schemas.BotApiKey

  def get_user!(api_key) do
    case Repo.one(from(b in BotApiKey, preload: [:bot], limit: 1, where: b.apiKey == ^api_key)) do
      %{bot: bot} -> bot
      _ -> nil
    end
  end
end

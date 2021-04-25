defmodule Beef.Mutations.Bots do
  alias Beef.Repo
  alias Beef.Schemas.User
  alias Beef.Schemas.BotApiKey

  def create(owner_id, username) do
    new_bot = %{
      id: Ecto.UUID.generate(),
      username: username,
      # @todo pick better default
      avatarUrl: "https://pbs.twimg.com/profile_images/1384417471944290304/4epg3HTW_400x400.jpg",
      displayName: username,
      bio: "I am a bot"
    }

    user_changeset = User.edit_changeset(%User{}, new_bot)

    Repo.insert(
      BotApiKey.insert_changeset(
        %BotApiKey{},
        %{
          apiKey: Ecto.UUID.generate(),
          ownerId: owner_id,
          # @todo figure out the cleaner ecto syntax for this
          botId: new_bot.id
        },
        user_changeset
      )
    )
  end
end

defmodule Kousa.Support.Factory do

  @moduledoc """
  defines the `create/2` function.

  Parameter 1:  The module for the schema representing the database table
  You are trying to populate.

  Parameter 2: any fields we would like to override.
  """

  alias Beef.Repo
  alias Beef.Schemas.User
  alias Beef.Schemas.Room

  def create(struct, data \\ [])

  def create(User, data) do
    merged_data =
      Keyword.merge(
        [
          githubId: Faker.Internet.user_name(),
          twitterId: Faker.Internet.user_name(),
          displayName: Faker.Internet.user_name(),
          username: Faker.Internet.user_name(),
          email: Faker.Internet.free_email(),
          githubAccessToken: "ntoaunthanuheoh",
          avatarUrl: "https://example.com/abc.jpg",
          bio: "a dogehouse user",
          tokenVersion: 1,
          numFollowing: 0,
          numFollowers: 0
        ],
        data
      )

    User
    |> struct(merged_data)
    |> Repo.insert!(returning: true)
  end

  def create(Room, data) do
    # if we don't specify the creatorId, then pre-emptively
    # create a new user to be the creator.
    creator_id = Keyword.get_lazy(data, :creatorId, fn ->
      create(User).id
    end)

    merged_data =
      Keyword.merge(
        [
          name: Faker.Beer.brand(),
          creatorId: creator_id,
          numPeopleInside: 1,
          voiceServerId: UUID.uuid4(),
          isPrivate: false
        ],
        data
      )

    Room
    |> struct(merged_data)
    |> Repo.insert!(returning: true)
  end
end

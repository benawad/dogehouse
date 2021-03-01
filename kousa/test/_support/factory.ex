defmodule Kousa.Support.Factory do
  alias Beef.{User, Repo, Room}

  def create(User, data \\ []) do
    merged_data =
      Keyword.merge(
        [
          githubId: Faker.Internet.user_name(),
          twitterId: Faker.Internet.user_name(),
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

  def create_room(Room, creator_id, data \\ []) do
    merged_data =
      Keyword.merge(
        [
          name: Faker.Beer.brand(),
          creatorId: creator_id,
          numPeopleInside: 1,
          voiceServerId: "",
          isPrivate: false
        ],
        data
      )

    Room
    |> struct(merged_data)
    |> Repo.insert!(returning: true)
  end
end

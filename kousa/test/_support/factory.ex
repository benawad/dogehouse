defmodule Kousa.Support.Factory do
  alias Beef.Repo
  alias Beef.User
  alias Beef.Room

  def create(struct, data \\ [])

  def create(User, data) do
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

  def create(Room, data) do
    # build a userId by creating a user id, if it
    # doesn't exist
    creator_id =
      Keyword.get_lazy(
        data,
        :creatorId,
        fn -> create(User).id end
      )

    merged_data =
      Keyword.merge(
        [
          name: Faker.Company.buzzword(),
          numPeopleInside: 0,
          isPrivate: false,
          voiceServerId: UUID.uuid4(),
          creatorId: creator_id,
          peoplePreviewList: []
        ],
        data
      )

    Room
    |> struct(merged_data)
    |> Repo.insert!(returning: true)
  end
end

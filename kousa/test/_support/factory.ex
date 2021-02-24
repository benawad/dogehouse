defmodule Kousa.Support.Factory do
  alias Beef.Repo
  alias Beef.User

  def create(User, data \\ []) do
    merged_data = Keyword.merge([
      githubId: Faker.Internet.user_name(),
      twitterId: Faker.Internet.user_name(),
      username: Faker.Internet.user_name(),
      email: Faker.Internet.free_email(),
      githubAccessToken: "ntoaunthanuheoh",
      avatarUrl: "https://example.com/abc.jpg",
      bio: "a dogehouse user",
      tokenVersion: 1,
      numFollowing: 0,
      numFollowers: 0], data)

    User
    |> struct(merged_data)
    |> Repo.insert!
  end
end

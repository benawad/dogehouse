defmodule KousaTest.Support.Factory do
  @moduledoc """
  defines the `create/2` function.

  Parameter 1:  The module for the schema representing the database table
  You are trying to populate.

  Parameter 2: any fields we would like to override.
  """

  alias Beef.Repo
  alias Beef.Schemas.User
  alias Beef.Schemas.ScheduledRoom
  alias Beef.Schemas.Room

  def create(struct, data \\ [])

  def create(User, data) do
    merged_data =
      Keyword.merge(
        [
          githubId: Faker.Internet.user_name(),
          twitterId: Faker.Internet.user_name(),
          displayName: Faker.Internet.user_name(),
          username: String.slice(String.replace(Faker.Internet.user_name(), ".", "_"), 0..14),
          email: Faker.Internet.free_email(),
          githubAccessToken: "ntoaunthanuheoh",
          avatarUrl: "https://example.com/abc.jpg",
          bannerUrl: "https://example.com/abc.jpg",
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
    creator_id =
      Keyword.get_lazy(data, :creatorId, fn ->
        create(User).id
      end)

    merged_data =
      Keyword.merge(
        [
          name: Faker.Company.buzzword(),
          numPeopleInside: 1,
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

  def create(ScheduledRoom, data) do
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
          description: "",
          numAttendees: 0,
          creatorId: creator_id,
          scheduledFor: DateTime.utc_now() |> Timex.shift(days: 1)
        ],
        data
      )

    ScheduledRoom
    |> struct(merged_data)
    |> Repo.insert!(returning: true)
  end
end

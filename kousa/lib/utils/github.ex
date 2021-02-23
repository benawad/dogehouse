defmodule Kousa.Github do
  def pick_primary_email([]) do
    nil
  end

  def pick_primary_email(emails) do
    primary_email = Enum.find(emails, &(&1["primary"] == true))

    if(is_nil(primary_email),
      do: Enum.at(emails, 0)["email"],
      else: primary_email["email"]
    )
  end

  def get_email(access_token) do
    case HTTPoison.get("https://api.github.com/user/emails", [
           {"Authorization", "token " <> access_token}
         ]) do
      {:ok, %HTTPoison.Response{status_code: 200, body: body}} ->
        emails = Poison.decode!(body)

        case emails do
          [] ->
            IO.puts("empty email for github user which should never happen")
            nil

          _ ->
            emails
            |> pick_primary_email()
        end

      x ->
        IO.inspect(x)
        nil
    end
  end

  def get_user(access_token) do
    case HTTPoison.get("https://api.github.com/user", [
           {"Authorization", "token " <> access_token}
         ]) do
      {:ok, %HTTPoison.Response{status_code: 200, body: body}} ->
        user = Poison.decode!(body)

        Map.put(
          user,
          "email",
          get_email(access_token)
        )

      x ->
        IO.inspect(x)
        nil
    end
  end

  def get_followers(access_token, cursor) do
    case HTTPoison.post(
           "https://api.github.com/graphql",
           Poison.encode!(%{
             query:
               "query($cursor: String) {  viewer {    following(first: 100, after: $cursor) {      nodes {        databaseId        login        name        avatarUrl        bio      }      pageInfo {        endCursor        hasNextPage      }    }  }}",
             variables: %{cursor: cursor}
           }),
           [
             {"Authorization", "token " <> access_token},
             {"Content-Type", "application/json"},
             {"Accept", "application/json"}
           ]
         ) do
      {:ok, %HTTPoison.Response{status_code: 200, body: body}} ->
        {:ok, Poison.decode!(body)}

      x ->
        IO.inspect(x)
        {:err, nil}
    end
  end
end

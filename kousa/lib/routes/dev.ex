defmodule Kousa.Dev do
  import Plug.Conn

  use Plug.Router

  plug(:match)
  plug(:dispatch)

  get "/test-info" do
    if Application.fetch_env!(:kousa, :env) != :dev do
      conn
      |> put_resp_content_type("application/json")
      |> send_resp(400, Poison.encode!(%{"error" => "no"}))
    else
      username = fetch_query_params(conn).query_params["username"]

      conn
      |> put_resp_content_type("application/json")
      |> send_resp(
        200,
        Poison.encode!(
          Kousa.TokenUtils.create_tokens(
            Beef.Repo.insert!(
              %Beef.User{
                username: username,
                email: "test@" <> username <> "test.com",
                githubAccessToken: "",
                githubId: "id:" <> username,
                avatarUrl: "https://placekitten.com/200/200",
                displayName: String.capitalize(username),
                bio:
                  "This is some interesting info about the ex-founder of nothing, welcome to the bio of such a ocol pers on !"
              },
              returning: true
            )
          )
        )
      )
    end
  end
end

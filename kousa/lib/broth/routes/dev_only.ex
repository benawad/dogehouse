defmodule Broth.Routes.DevOnly do
  import Plug.Conn

  alias Beef.Schemas.User

  use Plug.Router

  plug(:match)
  plug(:dispatch)

  get "/test-info" do
    env = Application.fetch_env!(:kousa, :env)
    staging? = Application.get_env(:kousa, :staging?)

    if env == :dev || staging? do
      username = fetch_query_params(conn).query_params["username"]
      user = Beef.Users.get_by_username(username)

      conn
      |> put_resp_content_type("application/json")
      |> send_resp(
        200,
        Jason.encode!(
          Kousa.Utils.TokenUtils.create_tokens(
            if(is_nil(user),
              do:
                Beef.Repo.insert!(
                  %User{
                    username: username,
                    email: "test@" <> username <> "test.com",
                    githubAccessToken: "",
                    githubId: "id:" <> username,
                    avatarUrl: "https://placekitten.com/200/200",
                    bannerUrl: "https://placekitten.com/1000/300",
                    displayName: String.capitalize(username),
                    bio:
                      "This is some interesting info about the ex-founder of nothing, welcome to the bio of such a ocol pers on !"
                  },
                  returning: true
                ),
              else: user
            )
          )
        )
      )
    else
      conn
      |> put_resp_content_type("application/json")
      |> send_resp(400, Jason.encode!(%{"error" => "no"}))
    end
  end
end

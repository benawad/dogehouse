defmodule Broth.Routes.BotAuth do
  import Plug.Conn

  use Plug.Router

  plug(Broth.Plugs.Cors)

  plug(Plug.Parsers,
    parsers: [:json],
    pass: ["text/*"],
    json_decoder: Poison
  )

  plug(:match)
  plug(:dispatch)

  alias Onion.BotAuthRateLimit
  alias Beef.Users

  post "/auth" do
    with %{"apiKey" => api_key} <- conn.body_params,
         {:ok, _} <- Ecto.UUID.cast(api_key) do
      key = to_string(:inet_parse.ntoa(conn.remote_ip))

      if (BotAuthRateLimit.get(key) || 0) > 20 do
        conn
        |> put_resp_content_type("application/json")
        |> send_resp(
          429,
          Poison.encode!(%{error: "too many invalid requests"})
        )
      else
        user = Users.get_by_api_key(api_key)

        if is_nil(user) do
          # @todo refactor to atomic increment
          # this didn't work :(
          # BotAuthRateLimit.update_counter(key, 1, 1)
          BotAuthRateLimit.set(key, (BotAuthRateLimit.get(key) || 0) + 1)

          conn
          |> put_resp_content_type("application/json")
          |> send_resp(
            400,
            Poison.encode!(%{error: "invalid input"})
          )
        else
          conn
          |> put_resp_content_type("application/json")
          |> send_resp(
            200,
            Poison.encode!(%{
              accessToken: Kousa.AccessToken.generate_and_sign!(%{"userId" => user.id}),
              refreshToken:
                Kousa.RefreshToken.generate_and_sign!(%{
                  "userId" => user.id,
                  "tokenVersion" => user.tokenVersion
                })
            })
          )
        end
      end
    else
      _ ->
        conn
        |> put_resp_content_type("application/json")
        |> send_resp(
          400,
          Poison.encode!(%{error: "invalid input"})
        )
    end
  end
end

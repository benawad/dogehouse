defmodule Broth.Routes.BotAuth do
  import Plug.Conn

  use Plug.Router

  plug(Broth.Plugs.Cors)

  plug(Plug.Parsers,
    parsers: [:json],
    pass: ["text/*"],
    json_decoder: Jason
  )

  plug(:match)
  plug(:dispatch)

  alias Onion.BotAuthRateLimit
  alias Beef.Users

  @env Mix.env()

  post "/auth" do
    with %{"apiKey" => api_key} <- conn.body_params,
         {:ok, _} <- Ecto.UUID.cast(api_key) do
      is_test = :test == @env

      key =
        with true <- is_test,
             x when not is_nil(x) <- :proplists.get_value("rate-limit-key", conn.req_headers, nil) do
          x
        else
          _ -> IP.to_string(conn.remote_ip)
        end

      max_attempts = if is_test, do: 5, else: 20

      if (BotAuthRateLimit.get(key) || 0) > max_attempts do
        conn
        |> put_resp_content_type("application/json")
        |> send_resp(
          429,
          Jason.encode!(%{error: "too many invalid requests"})
        )
      else
        user = Users.get_by_api_key(api_key)

        cond do
          is_nil(user) ->
            # @todo refactor to atomic increment
            # this didn't work :(
            # BotAuthRateLimit.update_counter(key, 1, 1)
            BotAuthRateLimit.set(key, (BotAuthRateLimit.get(key) || 0) + 1)

            conn
            |> put_resp_content_type("application/json")
            |> send_resp(
              400,
              Jason.encode!(%{error: "invalid input"})
            )

          not is_nil(user.reasonForBan) ->
            conn
            |> put_resp_content_type("application/json")
            |> send_resp(
              400,
              Jason.encode!(%{error: "your account is banned"})
            )

          true ->
            conn
            |> put_resp_content_type("application/json")
            |> send_resp(
              200,
              Jason.encode!(%{
                username: user.username,
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
          Jason.encode!(%{error: "invalid input"})
        )
    end
  end
end

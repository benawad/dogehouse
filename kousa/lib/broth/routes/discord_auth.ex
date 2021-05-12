defmodule Broth.Routes.DiscordAuth do
  import Plug.Conn
  use Plug.Router

  alias Beef.Users

  plug(:match)
  plug(:dispatch)

  get "/web" do
    state =
      if Application.get_env(:kousa, :staging?) do
        %{
          redirect_base_url: fetch_query_params(conn).query_params["redirect_after_base"]
        }
        |> Jason.encode!()
        |> Base.encode64()
      else
        "web"
      end

    %{conn | params: Map.put(conn.params, "state", state)}
    |> Plug.Conn.put_private(:ueberauth_request_options, %{
      callback_url: Application.get_env(:kousa, :api_url) <> "/auth/discord/callback",
      options: [
        default_scope: "identify email",
        prompt: "none" 
      ]
    })
    |> Ueberauth.Strategy.Discord.handle_request!()
  end

  get "/callback" do
    conn
    |> fetch_query_params()
    |> Plug.Conn.put_private(:ueberauth_request_options, %{
      callback_url: Application.get_env(:kousa, :api_url) <> "/auth/discord/callback",
      options: []
    })
    |> Ueberauth.Strategy.Discord.handle_callback!()
    |> handle_callback()
  end

  def get_base_url(conn) do
    with true <- Application.get_env(:kousa, :staging?),
         state <- Map.get(conn.query_params, "state", ""),
         {:ok, json} <- Base.decode64(state),
         {:ok, %{"redirect_base_url" => redirect_base_url}} when is_binary(redirect_base_url) <-
           Jason.decode(json) do
      redirect_base_url
    else
      _ ->
        Application.fetch_env!(:kousa, :web_url)
    end
  end

  def handle_callback(
        %Plug.Conn{assigns: %{ueberauth_failure: %{errors: [%{message_key: "missing_code"}]}}} =
          conn
      ) do
    conn
    |> Broth.Plugs.Redirect.redirect(
      get_base_url(conn) <>
        "/?error=" <>
        URI.encode("try again")
    )
  end

  def handle_callback(%Plug.Conn{assigns: %{ueberauth_failure: failure}} = conn) do
    IO.puts("Discord oauth failure")
    IO.inspect(failure)

    conn
    |> Broth.Plugs.Redirect.redirect(
      get_base_url(conn) <>
        "/?error=" <>
        URI.encode(
          "something went wrong, try again and if the error persists, tell ben to check the server logs"
        )
    )
  end

  def handle_callback(
        %Plug.Conn{private: %{discord_user: user, discord_token: %{access_token: access_token}}} =
          conn
      ) do
    try do
      {_, db_user} = Users.discord_find_or_create(user, access_token)

      if not is_nil(db_user.reasonForBan) do
        conn
        |> Broth.Plugs.Redirect.redirect(
          get_base_url(conn) <>
            "/?error=" <>
            URI.encode(
              "your account got banned, if you think this was a mistake, please send me an email at benawadapps@gmail.com"
            )
        )
      else
        conn
        |> Broth.Plugs.Redirect.redirect(
          get_base_url(conn) <>
            "/?accessToken=" <>
            Kousa.AccessToken.generate_and_sign!(%{"userId" => db_user.id}) <>
            "&refreshToken=" <>
            Kousa.RefreshToken.generate_and_sign!(%{
              "userId" => db_user.id,
              "tokenVersion" => db_user.tokenVersion
            })
        )
      end
    rescue
      e in RuntimeError ->
        conn
        |> Broth.Plugs.Redirect.redirect(
          get_base_url(conn) <>
            "/?error=" <>
            URI.encode(e.message)
        )
    end
  end
end

defmodule Kousa.Routes.TwitterAuth do
  import Plug.Conn
  use Plug.Router

  alias Beef.Users

  plug(:put_secret_key_base)

  plug(Plug.Session,
    store: :cookie,
    key: "_dogehouse_session",
    signing_salt: "YaQoOWg5"
  )

  plug(:match)
  plug(:dispatch)

  def put_secret_key_base(conn, _) do
    put_in(conn.secret_key_base, Application.get_env(:kousa, :secret_key_base))
  end

  get "/web" do
    state =
      if(
        Kousa.Caster.bool(Application.get_env(:kousa, :staging?)),
        do:
          %{
            redirect_base_url: fetch_query_params(conn).query_params["redirect_after_base"]
          }
          |> Poison.encode!()
          |> Base.encode64(),
        else: "web"
      )

    %{conn | params: Map.put(conn.params, "state", state)}
    |> Plug.Conn.put_private(:ueberauth_request_options, %{
      callback_url: Application.get_env(:kousa, :api_url) <> "/auth/twitter/callback",
      options: []
    })
    |> fetch_session()
    |> Ueberauth.Strategy.Twitter.handle_request!()
  end

  get "/callback" do
    conn_with_stuff =
      conn
      |> fetch_query_params
      |> fetch_session()

    try do
      conn_with_stuff
      |> Plug.Conn.put_private(:ueberauth_request_options, %{
        options: []
      })
      |> Ueberauth.Strategy.Twitter.handle_callback!()
      |> handle_callback()
    rescue
      e ->
        Sentry.capture_exception(e,
          stacktrace: __STACKTRACE__,
          extra: %{twitter_auth: "/callback"}
        )

        conn_with_stuff
        |> Kousa.Redirect.redirect(
          get_base_url(conn_with_stuff) <>
            "/?error=" <>
            URI.encode("auth failed, enable cookies and try again or give GitHub a try")
        )
    end
  end

  def get_base_url(conn) do
    with true <- Kousa.Caster.bool(Application.get_env(:kousa, :staging?)),
         state <- Map.get(conn.query_params, "state", ""),
         {:ok, json} <- Base.decode64(state),
         {:ok, %{"redirect_base_url" => redirect_base_url}} <- Poison.decode(json) do
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
    |> Kousa.Redirect.redirect(
      get_base_url(conn) <>
        "/?error=" <>
        URI.encode("try again")
    )
  end

  def handle_callback(%Plug.Conn{assigns: %{ueberauth_failure: failure}} = conn) do
    IO.puts("twitter oauth failure")
    IO.inspect(failure)

    conn
    |> Kousa.Redirect.redirect(
      get_base_url(conn) <>
        "/?error=" <>
        URI.encode(
          "something went wrong, try again and if the error persists, tell ben to check the server logs"
        )
    )
  end

  def handle_callback(
        %Plug.Conn{
          private: %{
            twitter_user: %{
              "description" => bio,
              "name" => displayName,
              "id_str" => twitterId,
              "email" => email,
              "profile_image_url_https" => avatarUrl
            }
          }
        } = conn
      ) do
    try do
      {_, db_user} =
        Users.twitter_find_or_create(%{
          bio: bio,
          displayName: displayName,
          twitterId: twitterId,
          email: email,
          avatarUrl: avatarUrl
        })

      if not is_nil(db_user.reasonForBan) do
        conn
        |> Kousa.Redirect.redirect(
          get_base_url(conn) <>
            "/?error=" <>
            URI.encode(
              "your account got banned, if you think this was a mistake, please send me an email at benawadapps@gmail.com"
            )
        )
      else
        conn
        |> Kousa.Redirect.redirect(
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
      e ->
        IO.inspect(e)

        Sentry.capture_exception(e,
          stacktrace: __STACKTRACE__,
          extra: %{rest: "twitter_login"}
        )

        conn
        |> Kousa.Redirect.redirect(
          get_base_url(conn) <>
            "/?error=" <>
            URI.encode("twitter login callback failed for some reason, tell ben to check logs")
        )
    end
  end

  def handle_callback(conn) do
    IO.puts("expected never to see this handle_callback in twitter_auth")
    IO.inspect(conn)

    conn
    |> Kousa.Redirect.redirect(
      get_base_url(conn) <>
        "/?error=" <>
        URI.encode(
          "something went wrong, try again and if the error persists, tell ben to check the server logs"
        )
    )
  end
end

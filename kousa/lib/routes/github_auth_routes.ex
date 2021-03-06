defmodule Kousa.Routes.GitHubAuth do
  import Plug.Conn
  use Plug.Router

  alias Beef.Users

  plug(:match)
  plug(:dispatch)

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
      callback_url: Application.get_env(:kousa, :api_url) <> "/auth/github/callback",
      options: [
        default_scope: "read:user,user:email"
      ]
    })
    |> Ueberauth.Strategy.Github.handle_request!()
  end

  get "/callback" do
    conn
    |> fetch_query_params()
    |> Plug.Conn.put_private(:ueberauth_request_options, %{
      options: []
    })
    |> Ueberauth.Strategy.Github.handle_callback!()
    |> handle_callback()
  end

  @spec get_base_url(Plug.Conn.t()) :: String.t()
  def get_base_url(conn) do
    with true <- Kousa.Caster.bool(Application.get_env(:kousa, :staging?)),
         state <- Map.get(conn.query_params, "state", ""),
         {:ok, json} <- Base.decode64(state),
         {:ok, %{"redirect_base_url" => redirect_base_url}} when is_binary(redirect_base_url) <-
           Poison.decode(json) do
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
    IO.puts("github oauth failure")
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
        %Plug.Conn{private: %{github_user: user, github_token: %{access_token: access_token}}} =
          conn
      ) do
    try do
      {_, db_user} =
        Users.github_find_or_create(
          %{user | "email" => Kousa.Github.pick_primary_email(user["emails"])},
          access_token
        )

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
      e in RuntimeError ->
        conn
        |> Kousa.Redirect.redirect(
          get_base_url(conn) <>
            "/?error=" <>
            URI.encode(e.message)
        )
    end
  end

  def handle_callback(conn) do
    IO.puts("expected never to see this handle_callback in github_auth")
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

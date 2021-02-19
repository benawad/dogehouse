defmodule Kousa.TwitterAuth do
  import Plug.Conn
  use Plug.Router

  alias Kousa.{Redirect, Data, Random}

  plug(:match)
  plug(:dispatch)

  get "/web" do
    token =
      ExTwitter.request_token(
        Application.get_env(:kousa, :api_url) <>
          "/auth/twitter/callback"
      )

    {:ok, authenticate_url} = ExTwitter.authenticate_url(token.oauth_token)

    Redirect.redirect(conn, authenticate_url)
  end

  get "/callback" do
    conn_with_qp = fetch_query_params(conn)
    base_url = Application.fetch_env!(:kousa, :web_url)

    try do
      with %{"oauth_token" => oauth_token, "oauth_verifier" => oauth_verifier} <-
             conn_with_qp.query_params,
           {:ok, access_token} <- ExTwitter.access_token(oauth_verifier, oauth_token),
           _ <-
             ExTwitter.configure(
               consumer_key: System.get_env("TWITTER_API_KEY"),
               consumer_secret: System.get_env("TWITTER_SECRET_KEY"),
               access_token: access_token.oauth_token,
               access_token_secret: access_token.oauth_token_secret
             ),
           %ExTwitter.Model.User{
             description: bio,
             name: displayName,
             id_str: twitterId,
             raw_data: %{email: email},
             profile_image_url_https: avatarUrl
           } <- ExTwitter.verify_credentials(include_email: true),
           {_, db_user} <-
             Data.User.twitter_find_or_create(%{
               bio: bio,
               displayName: displayName,
               twitterId: twitterId,
               email: email,
               avatarUrl: avatarUrl
             }) do
        if not is_nil(db_user.reasonForBan) do
          conn
          |> Kousa.Redirect.redirect(
            base_url <>
              "/?error=" <>
              URI.encode(
                "your account got banned, if you think this was a mistake, please send me an email at benawadapps@gmail.com"
              )
          )
        else
          conn
          |> Kousa.Redirect.redirect(
            base_url <>
              "/?accessToken=" <>
              Kousa.AccessToken.generate_and_sign!(%{"userId" => db_user.id}) <>
              "&refreshToken=" <>
              Kousa.RefreshToken.generate_and_sign!(%{
                "userId" => db_user.id,
                "tokenVersion" => db_user.tokenVersion
              })
          )
        end
      else
        x ->
          IO.inspect(x)

          conn
          |> Kousa.Redirect.redirect(
            base_url <>
              "/?error=" <>
              URI.encode("twitter login callback failed for some reason, tell ben to check logs")
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
          base_url <>
            "/?error=" <>
            URI.encode("twitter login callback failed for some reason, tell ben to check logs")
        )
    end
  end
end

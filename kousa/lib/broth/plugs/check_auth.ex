defmodule Broth.Plugs.CheckAuth do
  import Plug.Conn

  def init(opts) do
    opts
  end

  def call(conn, opts) do
    shouldThrow = if opts, do: opts[:shouldThrow], else: true

    do_error = fn ->
      if shouldThrow,
        do:
          conn
          |> send_resp(400, "Not authenticated")
          |> halt,
        else: conn
    end

    tokens =
      Enum.reduce(
        conn.req_headers,
        %{},
        fn {key, value}, acc ->
          case key do
            "x-access-token" -> Map.merge(acc, %{accessToken: value})
            "x-refresh-token" -> Map.merge(acc, %{refreshToken: value})
            _ -> acc
          end
        end
      )

    case tokens do
      %{accessToken: accessToken, refreshToken: refreshToken} ->
        case Kousa.Utils.TokenUtils.tokens_to_user_id(accessToken, refreshToken) do
          {nil, nil} ->
            do_error.()

          {userId, nil} ->
            conn |> assign(:user_id, userId)

          {userId, %{accessToken: newAccessToken, refreshToken: newRefreshToken}, user} ->
            conn
            |> put_resp_header(
              "X-Access-Token",
              newAccessToken
            )
            |> put_resp_header(
              "X-Refresh-Token",
              newRefreshToken
            )
            |> assign(:user_id, userId)
            |> assign(:user, user)
        end

      _ ->
        do_error.()
    end
  end
end

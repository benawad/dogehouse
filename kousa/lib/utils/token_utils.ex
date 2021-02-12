defmodule Kousa.TokenUtils do
  alias Beef.{Repo, User}
  alias Kousa.{AccessToken, RefreshToken}

  @type tokens :: %{
          accessToken: String.t(),
          refreshToken: String.t()
        }

  @spec create_tokens(User.t()) :: tokens()
  def create_tokens(%User{id: id, tokenVersion: version}) do
    access_token_params = %{"userId" => id}

    refresh_token_params =
      access_token_params
      |> Map.put("tokenVersion", version)

    %{
      accessToken: AccessToken.generate_and_sign!(access_token_params),
      refreshToken: RefreshToken.generate_and_sign!(refresh_token_params)
    }
  end

  @spec tokens_to_user_id(String.t(), String.t()) ::
          {:ok, user_id :: String.t()} | {:ok, user_id :: String.t(), tokens()} | {:error, any()}
  def tokens_to_user_id(accessToken, refreshToken) do
    accessToken = accessToken || ""
    refreshToken = refreshToken || ""

    case AccessToken.verify_and_validate(accessToken) do
      {:ok, %{"userId" => id}} ->
        {:ok, id}

      _ ->
        refresh_token(refreshToken)
    end
  end

  defp refresh_token(refreshToken) do
    case RefreshToken.verify_and_validate(refreshToken) do
      {:ok, %{"userId" => id, "tokenVersion" => token_version}} ->
        with %User{reasonForBan: reason, tokenVersion: version} = user <- Repo.get(User, id) do
          cond do
            not is_nil(reason) ->
              {:error, :user_banned}

            version != token_version ->
              {:error, :invalid_refresh_token_version}

            true ->
              {:ok, id, create_tokens(user)}
          end
        else
          nil ->
            {:error, :user_not_found}
        end

      {:error, _reason} = error ->
        error
    end
  end
end

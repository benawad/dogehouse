defmodule Kousa.Utils.TokenUtils do
  alias Beef.Schemas.User
  alias Kousa.Utils.UUID

  # TODO: refactor this
  @type new_tokens :: %{
          accessToken: String.t(),
          refreshToken: String.t()
        }

  @type new_token_result :: {
          :new_tokens,
          UUID.t(),
          new_tokens(),
          Beef.Schemas.User.t()
        }

  # TODO: this is a bit of a hacky way to label our types.  this will have to be
  # revisited in a future revision.
  @type token_result ::
          nil
          | {:existing_claim, term}
          | new_token_result()

  @spec tokens_to_user_id(String.t(), String.t()) :: token_result
  def tokens_to_user_id(access_token!, refresh_token) do
    access_token! = access_token! || ""

    case Kousa.AccessToken.verify_and_validate(access_token!) do
      {:ok, claims} ->
        {:existing_claim, claims["userId"]}

      _ ->
        verify_refresh_token(refresh_token)
    end
  end

  @spec verify_refresh_token(String.t()) :: new_token_result() | nil
  defp verify_refresh_token(refresh_token!) do
    refresh_token! = refresh_token! || ""

    case Kousa.RefreshToken.verify_and_validate(refresh_token!) do
      {:ok, refreshClaims} ->
        user = Beef.Repo.get(User, refreshClaims["userId"])

        if user &&
             !user.reasonForBan &&
             user.tokenVersion == refreshClaims["tokenVersion"] do
          {:new_tokens, user.id, create_tokens(user), user}
        end

      _ ->
        nil
    end
  end

  def create_tokens(user) do
    %{
      accessToken: Kousa.AccessToken.generate_and_sign!(%{"userId" => user.id}),
      refreshToken:
        Kousa.RefreshToken.generate_and_sign!(%{
          "userId" => user.id,
          "tokenVersion" => user.tokenVersion
        })
    }
  end
end

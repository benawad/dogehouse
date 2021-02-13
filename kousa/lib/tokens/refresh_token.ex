defmodule Kousa.RefreshToken do
  def __default_signer__,
    do: Joken.Signer.create("HS256", Application.fetch_env!(:kousa, :refresh_token_secret))

  use Joken.Config

  # 30 days
  def token_config, do: default_claims(default_exp: 60 * 60 * 24 * 30)
end

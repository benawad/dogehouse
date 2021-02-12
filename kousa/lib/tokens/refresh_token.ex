defmodule Kousa.RefreshToken do
  use Joken.Config, default_signer: :refresh_token_secret

  # 30 days
  def token_config(), do: default_claims(default_exp: 60 * 60 * 24 * 30)
end

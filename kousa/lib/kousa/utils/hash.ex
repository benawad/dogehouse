defmodule Kousa.Utils.Hash do
  alias Argon2

  @type hash_result :: String.t() | :error

  @type hash_check :: {:ok, hash_result} | {:error, String.t()}

  @spec hash_ip(String.t()) :: hash_result
  def hash_ip(ip) do
    Argon2.hash_pwd_salt(ip)
  end

  @spec check_hash(Kousa.User, String.t()) :: hash_check
  def check_hash(account, ip) do
    if is_nil(account.ip) do
      {:error, "no ip was stored in database"}
    else
      matched = Argon2.verify_pass(ip, account.ip)

      if matched do
        {:ok, ip}
      else
        {:error, "ip doesn't match with stored hash"}
      end
    end
  end
end

defmodule Kousa.Utils.Hash do
  alias Argon2
  alias IO

  @type hash_result :: String.t() | {:error, String.t()}

  @type hash_check :: {:ok, hash_result} | {:error, String.t()}

  @spec hash_ip(String.t()) :: hash_result
  def hash_ip(ip) do
    if is_nil(ip) do
      {:error, "ip is nil"}
    else
      :crypto.mac(:hmac, :sha256, Application.fetch_env!(:kousa, :ip_hashing_key), ip)
      |> Base.encode16()
    end
  end

  @spec check_hash(Kousa.User, String.t()) :: hash_check
  def check_hash(account, ip) do
    if is_nil(account.ip) do
      {:error, "no ip was stored in database"}
    else
      # Prevents timing attacks
      matched = Plug.Crypto.secure_compare(ip, account.ip)

      if matched do
        {:ok, ip}
      else
        {:error, "ip doesn't match with stored hash"}
      end
    end
  end
end

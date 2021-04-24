defmodule Kousa.Utils.VoiceServerUtils do
  def idx_to_str_id(n) do
    case n do
      0 -> ""
      x -> Integer.to_string(x)
    end
  end

  def get_next_voice_server_id() do
    idx_to_str_id(:rand.uniform(Application.get_env(:kousa, :num_voice_servers, 1)) - 1)
  end
end

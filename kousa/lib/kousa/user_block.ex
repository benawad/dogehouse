defmodule Kousa.UserBlock do
  alias Beef.UserBlocks
  alias Beef.Follows

  def block(user_id, user_id_to_block) do
    Follows.delete(user_id, user_id_to_block)
    UserBlocks.insert(%{userId: user_id, userIdBlocked: user_id_to_block})
  end
end

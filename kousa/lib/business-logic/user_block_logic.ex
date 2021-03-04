defmodule Kousa.BL.UserBlock do

  alias Beef.UserBlocks

  def block(user_id, user_id_to_block) do
    Kousa.Data.Follower.delete(user_id, user_id_to_block)
    UserBlocks.insert(%{userId: user_id, userIdBlocked: user_id_to_block})
  end
end

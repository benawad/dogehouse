defmodule Beef.Bots do
  @moduledoc """
  Empty context module for Bots
  """

  # ACCESS functions
  defdelegate get_user!(api_key),
    to: Beef.Access.Bots

  # MUTATION functions
  defdelegate create(owner_id, username),
    to: Beef.Mutations.Bots
end

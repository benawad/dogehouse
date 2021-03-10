defmodule Beef.Mutations.UserBlocks do
  @moduledoc """
    DB Mutation functions for UserBlocks
  """

  alias Beef.Schemas.UserBlock
  alias Beef.Repo

  def insert(data) do
    %UserBlock{}
    |> UserBlock.insert_changeset(data)
    |> Repo.insert(on_conflict: :nothing)
  end
end

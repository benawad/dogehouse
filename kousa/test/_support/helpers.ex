defmodule Kousa.Support.Helpers do

  # see https://hexdocs.pm/ecto/testing-with-ecto.html
  def checkout_ecto_sandbox(tags) do
    :ok = Ecto.Adapters.SQL.Sandbox.checkout(Beef.Repo)

    unless tags[:async] do
      Ecto.Adapters.SQL.Sandbox.mode(Beef.Repo, {:shared, self()})
    end

    :ok
  end
end

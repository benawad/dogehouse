defmodule KousaTest.Support.EctoSandbox do
  # see https://hexdocs.pm/ecto/testing-with-ecto.html

  defmacro __using__(_) do
    quote do
      def checkout_ecto_sandbox(tags) do
        :ok = Ecto.Adapters.SQL.Sandbox.checkout(Beef.Repo)

        unless tags[:async] do
          Ecto.Adapters.SQL.Sandbox.mode(Beef.Repo, {:shared, self()})
        end

        :ok
      end

      setup :checkout_ecto_sandbox
    end
  end
end

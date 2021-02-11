defmodule Beef.Repo do
  use Ecto.Repo,
    otp_app: :kousa,
    adapter: Ecto.Adapters.Postgres
end

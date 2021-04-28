defmodule Broth.Routes.Stats do
  import Plug.Conn

  use Plug.Router

  plug(Broth.Plugs.Cors)
  plug(:match)
  plug(:dispatch)

  alias Onion.StatsCache
  alias Beef.Repo
  alias Beef.Schemas.User

  defp getStats do
    d = {DateTime.now!("Etc/UTC"), {Repo.aggregate(User, :count, :id)}}
    StatsCache.set("main", d)
    d
  end

  get "/" do
    {dt, {numUsers}} =
      case StatsCache.get("main") do
        nil ->
          getStats()

        {dt, stats} ->
          # 1 day
          exp_dt = DateTime.add(dt, 60 * 60 * 24, :second)

          if :lt == DateTime.compare(exp_dt, DateTime.now!("Etc/UTC")) do
            getStats()
          else
            {dt, stats}
          end
      end

    conn
    |> put_resp_content_type("application/json")
    |> send_resp(
      200,
      Poison.encode!(%{"numUsers" => numUsers, "lastUpdated" => DateTime.to_iso8601(dt)})
    )
  end
end

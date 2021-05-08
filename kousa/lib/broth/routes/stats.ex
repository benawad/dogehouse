defmodule Broth.Routes.Stats do
  import Plug.Conn
  import Ecto.Query

  use Plug.Router
  use Timex

  plug(Broth.Plugs.Cors)
  plug(:match)
  plug(:dispatch)

  alias Onion.StatsCache
  alias Beef.Repo
  alias Beef.Schemas.User

  defp getStats do
    two_days_ago = Timex.now() |> Timex.shift(days: -2)

    query =
      from(u in User,
        where: u.lastOnline > ^two_days_ago or u.online
      )

    numActive = Repo.aggregate(query, :count, :id)

    d = {DateTime.now!("Etc/UTC"), {Repo.aggregate(User, :count, :id), numActive}}
    StatsCache.set("main", d)
    d
  end

  get "/" do
    {dt, {numUsers, numActive}} =
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
      Jason.encode!(%{
        "numUsers" => numUsers,
        "activeInLastTwoDays" => numActive,
        "lastUpdated" => DateTime.to_iso8601(dt)
      })
    )
  end
end

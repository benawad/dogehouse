defmodule Kousa.Gen.Rabbit do
  use GenServer
  use AMQP

  def start_link(_) do
    GenServer.start_link(__MODULE__, [], name: __MODULE__)
  end

  # @send_exchange "shawarma_exchange"
  @send_queue "shawarma_queue"
  @receive_exchange "kousa_exchange"
  @receive_queue "kousa_queue"

  def init(_opts) do
    {:ok, conn} =
      Connection.open(Application.get_env(:kousa, :rabbit_url, "amqp://guest:guest@localhost"))

    {:ok, chan} = Channel.open(conn)
    setup_queue(chan)

    # Register the GenServer process as a consumer
    {:ok, _consumer_tag} = Basic.consume(chan, @receive_queue, nil, no_ack: true)
    {:ok, chan}
  end

  def send(msg) do
    GenServer.cast(__MODULE__, {:send, Poison.encode!(msg)})
  end

  def handle_cast({:send, msg}, chan) do
    # IO.puts("SENDING TO RABBIT : ")
    AMQP.Basic.publish(chan, "", @send_queue, msg)
    {:noreply, chan}
  end

  def handle_info({:basic_consume_ok, %{consumer_tag: _consumer_tag}}, chan) do
    {:noreply, chan}
  end

  # Sent by the broker when the consumer is unexpectedly cancelled (such as after a queue deletion)
  def handle_info({:basic_cancel, %{consumer_tag: _consumer_tag}}, chan) do
    {:stop, :normal, chan}
  end

  # Confirmation sent by the broker to the consumer process after a Basic.cancel
  def handle_info({:basic_cancel_ok, %{consumer_tag: _consumer_tag}}, chan) do
    {:noreply, chan}
  end

  def handle_info(
        {:basic_deliver, payload, %{delivery_tag: _tag, redelivered: _redelivered}},
        chan
      ) do
    data = Poison.decode!(payload)

    case data do
      %{"platform" => platform, "uid" => user_id} ->
        platform_atom =
          case platform do
            "web" -> :web
            "vscode" -> :vscode
            _ -> :all
          end

        # IO.puts("RABBIT RESPONDED: " <> data["op"])

        Kousa.Gen.UserSession.send_cast(
          user_id,
          {:send_ws_msg, platform_atom, Map.delete(data, "uid")}
        )

      %{"platform" => platform, "rid" => room_id} ->
        platform_atom =
          case platform do
            "web" -> :web
            "vscode" -> :vscode
            _ -> :all
          end

        # IO.puts("RABBIT RESPONDED: " <> data["op"])

        Kousa.Gen.RoomSession.send_cast(
          room_id,
          {:send_ws_msg, platform_atom, Map.delete(data, "rid")}
        )
    end

    # You might want to run payload consumption in separate Tasks in production
    # consume(chan, tag, redelivered, payload)
    {:noreply, chan}
  end

  defp setup_queue(chan) do
    {:ok, _} = Queue.declare(chan, @send_queue, durable: true)
    {:ok, _} = Queue.declare(chan, @receive_queue, durable: true)

    :ok = Exchange.fanout(chan, @receive_exchange, durable: true)
    :ok = Queue.bind(chan, @receive_queue, @receive_exchange)
  end
end

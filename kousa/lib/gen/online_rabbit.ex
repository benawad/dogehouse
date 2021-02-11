defmodule Kousa.Gen.OnlineRabbit do
  use GenServer
  use AMQP

  def start_link(_) do
    GenServer.start_link(__MODULE__, [], name: __MODULE__)
  end

  # @send_exchange "shawarma_exchange"
  @online_exchange "kousa_online_exchange"
  @online_receive_queue "kousa_online_queue"

  def init(_opts) do
    {:ok, conn} =
      Connection.open(Application.get_env(:kousa, :rabbit_url, "amqp://guest:guest@localhost"))

    {:ok, chan} = Channel.open(conn)
    setup_queue(chan)

    :ok = Basic.qos(chan, prefetch_count: 1)
    # Register the GenServer process as a consumer
    {:ok, _consumer_tag} = Basic.consume(chan, @online_receive_queue, nil, no_ack: true)
    {:ok, chan}
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
      %{"op" => "online"} ->
        GenRegistry.reduce(Kousa.Gen.UserSession, {nil, -1}, fn
          {_, pid}, acc ->
            send(pid, {:reconnect_to_voice_server})

            acc
        end)
    end

    # You might want to run payload consumption in separate Tasks in production
    # consume(chan, tag, redelivered, payload)
    {:noreply, chan}
  end

  defp setup_queue(chan) do
    {:ok, _} = Queue.declare(chan, @online_receive_queue, durable: true)

    :ok = Exchange.fanout(chan, @online_exchange, durable: true)
    :ok = Queue.bind(chan, @online_receive_queue, @online_exchange)
  end
end

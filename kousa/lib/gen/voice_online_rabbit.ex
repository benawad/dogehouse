# used to alert the elixir server when the voice server starts up for the first time
defmodule Kousa.Gen.VoiceOnlineRabbit do
  use GenServer
  use AMQP

  defmodule State do
    @type t :: %{
            id: String.t(),
            chan: map()
          }

    defstruct id: "", chan: nil
  end

  def start_link(%{id: id}) do
    GenServer.start_link(
      __MODULE__,
      %State{
        id: id
      },
      name: :"#{id}:voice_online_rabbit"
    )
  end

  # @send_exchange "shawarma_exchange"
  @online_exchange "kousa_online_exchange"
  @online_receive_queue "kousa_online_queue"

  def init(opts) do
    {:ok, conn} =
      Connection.open(Application.get_env(:kousa, :rabbit_url, "amqp://guest:guest@localhost"))

    {:ok, chan} = Channel.open(conn)
    setup_queue(opts.id, chan)

    :ok = Basic.qos(chan, prefetch_count: 1)
    queue_to_consume = @online_receive_queue <> opts.id
    IO.puts("queue_to_consume_online: " <> queue_to_consume)
    # Register the GenServer process as a consumer
    {:ok, _consumer_tag} = Basic.consume(chan, queue_to_consume, nil, no_ack: true)

    {:ok, %State{chan: chan, id: opts.id}}
  end

  def handle_info({:basic_consume_ok, %{consumer_tag: _consumer_tag}}, state) do
    {:noreply, state}
  end

  # Sent by the broker when the consumer is unexpectedly cancelled (such as after a queue deletion)
  def handle_info({:basic_cancel, %{consumer_tag: _consumer_tag}}, state) do
    {:stop, :normal, state}
  end

  # Confirmation sent by the broker to the consumer process after a Basic.cancel
  def handle_info({:basic_cancel_ok, %{consumer_tag: _consumer_tag}}, state) do
    {:noreply, state}
  end

  def handle_info(
        {:basic_deliver, payload, %{delivery_tag: _tag, redelivered: _redelivered}},
        %State{} = state
      ) do
    data = Poison.decode!(payload)

    case data do
      %{"op" => "online"} ->
        GenRegistry.reduce(Kousa.Gen.UserSession, {nil, -1}, fn
          {_, pid}, acc ->
            send(pid, {:reconnect_to_voice_server, state.id})

            acc
        end)
    end

    # You might want to run payload consumption in separate Tasks in production
    # consume(chan, tag, redelivered, payload)
    {:noreply, state}
  end

  defp setup_queue(id, chan) do
    {:ok, _} = Queue.declare(chan, @online_receive_queue <> id, durable: true)

    :ok = Exchange.fanout(chan, @online_exchange <> id, durable: true)
    :ok = Queue.bind(chan, @online_receive_queue <> id, @online_exchange <> id)
  end
end

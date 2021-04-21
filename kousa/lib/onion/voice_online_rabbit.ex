# used to alert the elixir server when the voice server starts up for the first time
defmodule Onion.VoiceOnlineRabbit do
  use GenServer, restart: :temporary
  use AMQP

  defmodule State do
    @type t :: %{
            id: String.t(),
            chan: map()
          }

    defstruct id: "", chan: nil
  end

  def start_supervised(voice_id) do
    DynamicSupervisor.start_child(
      Onion.VoiceOnlineRabbitDynamicSupervisor,
      {__MODULE__, voice_id}
    )
  end

  def start_link(voice_id) do
    GenServer.start_link(
      __MODULE__,
      voice_id,
      name: via(voice_id)
    )
  end

  defp via(voice_id), do: {:via, Registry, {Onion.VoiceOnlineRabbitRegistry, voice_id}}

  # @send_exchange "shawarma_exchange"
  @online_exchange "kousa_online_exchange"
  @online_receive_queue "kousa_online_queue"

  def init(voice_id) do
    {:ok, conn} =
      Connection.open(Application.get_env(:kousa, :rabbit_url, "amqp://guest:guest@localhost"))

    {:ok, chan} = Channel.open(conn)
    setup_queue(voice_id, chan)

    :ok = Basic.qos(chan, prefetch_count: 1)
    queue_to_consume = @online_receive_queue <> voice_id
    IO.puts("queue_to_consume_online: " <> queue_to_consume)
    # Register the GenServer process as a consumer
    {:ok, _consumer_tag} = Basic.consume(chan, queue_to_consume, nil, no_ack: true)

    {:ok, %State{chan: chan, id: voice_id}}
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
    case Jason.decode!(payload) do
      %{"op" => "online"} ->
        Onion.UserSession.force_reconnects(state.id)

      _ ->
        :ok
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

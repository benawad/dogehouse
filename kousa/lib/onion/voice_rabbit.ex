defmodule Onion.VoiceRabbit do
  use GenServer
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
      Onion.VoiceRabbitDynamicSupervisor,
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

  defp via(voice_id), do: {:via, Registry, {Onion.VoiceRabbitRegistry, voice_id}}

  # @send_exchange "shawarma_exchange"
  @send_queue "shawarma_queue"
  @receive_exchange "kousa_exchange"
  @receive_queue "kousa_queue"

  def init(voice_id) do
    {:ok, conn} =
      Connection.open(Application.get_env(:kousa, :rabbit_url, "amqp://guest:guest@localhost"))

    {:ok, chan} = Channel.open(conn)
    setup_queue(voice_id, chan)

    queue_to_consume = @receive_queue <> voice_id
    IO.puts("queue_to_consume: " <> queue_to_consume)
    # Register the GenServer process as a consumer
    {:ok, _consumer_tag} = Basic.consume(chan, queue_to_consume, nil, no_ack: true)
    {:ok, %State{chan: chan, id: voice_id}}
  end

  def send(id, msg) do
    GenServer.cast(via(id), {:send, msg})
  end

  def handle_cast({:send, msg}, %State{chan: chan, id: id} = state) do
    AMQP.Basic.publish(chan, "", @send_queue <> id, Jason.encode!(msg))
    {:noreply, state}
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
    data = Jason.decode!(payload)

    case data do
      %{"uid" => user_id} ->
        Onion.UserSession.send_ws(user_id, nil, Map.delete(data, "uid"))

      %{"rid" => room_id} ->
        Onion.RoomSession.broadcast_ws(
          room_id,
          Map.delete(data, "rid")
        )
    end

    # You might want to run payload consumption in separate Tasks in production
    # consume(chan, tag, redelivered, payload)
    {:noreply, state}
  end

  defp setup_queue(id, chan) do
    {:ok, _} = Queue.declare(chan, @send_queue <> id, durable: true)
    {:ok, _} = Queue.declare(chan, @receive_queue <> id, durable: true)

    :ok = Exchange.fanout(chan, @receive_exchange <> id, durable: true)
    :ok = Queue.bind(chan, @receive_queue <> id, @receive_exchange <> id)
  end
end

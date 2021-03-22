defmodule Broth.WsClient do
  use WebSockex

  @api_url Application.compile_env!(:kousa, :api_url)

  def start_link(_) do
    ancestors =
      :"$ancestors"
      |> Process.get()
      |> :erlang.term_to_binary()
      |> Base.encode16()

    @api_url
    |> Path.join("socket")
    |> WebSockex.start_link(__MODULE__, nil, extra_headers: [{"user-agent", ancestors}])
  end

  ###########################################################################
  # API

  def send_msg(ws_client, map), do: WebSockex.cast(ws_client, {:send, map})

  def send_msg_impl(map, state) do
    {:reply, {:text, Jason.encode!(map)}, state}
  end

  ###########################################################################
  # ROUTER

  @impl true
  def handle_frame({type, msg}, state) do
    IO.puts("Received Message - Type: #{inspect(type)} -- Message: #{inspect(msg)}")
    {:ok, state}
  end

  @impl true
  def handle_cast({:send, map}, state), do: send_msg_impl(map, state)
end

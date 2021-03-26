defmodule Broth.WsClient do
  use WebSockex

  @api_url Application.compile_env!(:kousa, :api_url)

  def start_link(opts) do
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

  defp send_msg_impl(map, test_pid) do
    {:reply, {:text, Jason.encode!(map)}, test_pid}
  end

  def forward_frames(ws_client), do: WebSockex.cast(ws_client, {:forward_frames, self()})
  defp forward_frames_impl(test_pid, _state), do: {:ok, test_pid}

  defmacro assert_frame(type, contents, opts \\ nil) do
    if opts do
      quote do
        ExUnit.Assertions.assert_receive({unquote(type), unquote(contents)}, unquote(opts))
      end
    else
      quote do
        ExUnit.Assertions.assert_receive({unquote(type), unquote(contents)})
      end
    end
  end

  defmacro assert_dies(ws_client, fun, reason, timeout \\ 100) do
    quote bind_quoted: [ws_client: ws_client, fun: fun, reason: reason, timeout: timeout] do
      Process.flag(:trap_exit, true)
      Process.link(ws_client)
      fun.()
      ExUnit.Assertions.assert_receive({:EXIT, ^ws_client, ^reason}, timeout)
    end
  end

  ###########################################################################
  # ROUTER

  @impl true
  def handle_frame({type, data}, test_pid) do
    send(test_pid, {type, Jason.decode!(data)})
    {:ok, test_pid}
  end

  @impl true
  def handle_cast({:send, map}, test_pid), do: send_msg_impl(map, test_pid)
  def handle_cast({:forward_frames, test_pid}, state), do: forward_frames_impl(test_pid, state)
end

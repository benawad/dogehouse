defmodule Broth.WsClient do
  use WebSockex

  @api_url Application.compile_env!(:kousa, :api_url)

  def child_spec(info) do
    # just make the id be a random uuid.
    info
    |> super
    |> Map.put(:id, UUID.uuid4())
  end

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

  # an elaboration on the send_msg that represents the equivalent of
  # "fetching" / "calling" operations from the user.
  def send_call(ws_client, op, payload) do
    call_ref = UUID.uuid4()
    WebSockex.cast(ws_client,
      {:send, %{"op" => op,
                "d" => payload,
                "fetchId" => call_ref}})
    call_ref
  end

  def send_msg(ws_client, op, payload),
    do: WebSockex.cast(ws_client, {:send, %{"op" => op, "d" => payload}})

  defp send_msg_impl(map, test_pid) do
    {:reply, {:text, Jason.encode!(map)}, test_pid}
  end

  def forward_frames(ws_client), do: WebSockex.cast(ws_client, {:forward_frames, self()})
  defp forward_frames_impl(test_pid, _state), do: {:ok, test_pid}

  defmacro assert_frame(op, payload) do
    quote do
      ExUnit.Assertions.assert_receive(
        {:text, %{"op" => unquote(op), "d" => unquote(payload)}}
      )
    end
  end

  defmacro assert_reply(ref, payload) do
    quote do
      ExUnit.Assertions.assert_receive(
        {:text, %{"op" => "fetch_done", "d" => unquote(payload), "fetchId" => unquote(ref)}}
      )
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

defmodule Broth.WsClientFactory do
  alias Beef.Schemas.User
  alias Broth.WsClient
  require WsClient

  import ExUnit.Assertions

  # note that this function ALSO causes the calling process to be subscribed
  # to forwarded messages from the websocket client.
  def create_client_for(user = %User{}) do
    tokens = Kousa.Utils.TokenUtils.create_tokens(user)

    # start and link the websocket client
    ws_client = ExUnit.Callbacks.start_supervised!(WsClient)
    Process.link(ws_client)
    WsClient.forward_frames(ws_client)

    WsClient.send_msg(ws_client, "auth", %{
      "accessToken" => tokens.accessToken,
      "refreshToken" => tokens.refreshToken,
      "platform" => "foo",
      "reconnectToVoice" => false,
      "muted" => false
    })

    WsClient.assert_frame("auth-good", _)

    ws_client
  end
end

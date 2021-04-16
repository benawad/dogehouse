defmodule Broth.SocketHandler do
  require Logger

  @type state :: %__MODULE__{
          awaiting_init: boolean(),
          user_id: String.t(),
          encoding: :etf | :json,
          compression: nil | :zlib
        }

  defstruct awaiting_init: true,
            user_id: nil,
            encoding: nil,
            compression: nil,
            callers: []

  @behaviour :cowboy_websocket

  def init(request, _state) do
    props = :cowboy_req.parse_qs(request)

    compression =
      case :proplists.get_value("compression", props) do
        p when p in ["zlib_json", "zlib"] -> :zlib
        _ -> nil
      end

    encoding =
      case :proplists.get_value("encoding", props) do
        "etf" -> :etf
        _ -> :json
      end

    state = %__MODULE__{
      awaiting_init: true,
      user_id: nil,
      encoding: encoding,
      compression: compression,
      callers: get_callers(request)
    }

    {:cowboy_websocket, request, state}
  end

  if Mix.env() == :test do
    defp get_callers(request) do
      request_bin = :cowboy_req.header("user-agent", request)

      List.wrap(
        if is_binary(request_bin) do
          request_bin
          |> Base.decode16!()
          |> :erlang.binary_to_term()
        end
      )
    end
  else
    defp get_callers(_), do: []
  end

  @auth_timeout Application.compile_env(:kousa, :websocket_auth_timeout)

  def websocket_init(state) do
    Process.send_after(self(), :auth_timeout, @auth_timeout)
    Process.put(:"$callers", state.callers)

    {:ok, state}
  end

  def websocket_info(:auth_timeout, state) do
    if state.awaiting_init do
      {:stop, state}
    else
      {:ok, state}
    end
  end

  def websocket_info({:remote_send, message}, state) do
    {:reply, prepare_socket_msg(message, state), state}
  end

  # @todo when we swap this to new design change this to 1000
  def websocket_info({:kill}, state) do
    {:reply, {:close, 4003, "killed_by_server"}, state}
  end

  # needed for Task.async not to crash things
  def websocket_info({:EXIT, _, _}, state) do
    {:ok, state}
  end

  def websocket_info({:send_to_linked_session, message}, state) do
    send(state.linked_session, message)
    {:ok, state}
  end

  def websocket_handle({:text, "ping"}, state) do
    {:reply, prepare_socket_msg("pong", state), state}
  end

  def websocket_handle({:ping, _}, state) do
    {:reply, prepare_socket_msg("pong", state), state}
  end

  @special_cases ~w(
    block_user_and_from_room
    fetch_follow_list
    join_room_and_get_info
    audio_autoplay_error
  )

  def websocket_handle({:text, command_json}, state) do
    with {:ok, message_map!} <- Jason.decode(command_json),
         # temporary trap mediasoup direct commands
         %{"op" => <<not_at>> <> _} when not_at != ?@ <- message_map!,
         # temporarily trap special cased commands
         %{"op" => not_special_case} when not_special_case not in @special_cases <- message_map!,
         # translation from legacy maps to new maps
         message_map! = Broth.Translator.translate_inbound(message_map!),
         {:ok, message = %{errors: nil}} <- validate(message_map!, state) do
      dispatch(message, state)
    else
      # special cases: mediasoup operations
      _mediasoup_op = %{"op" => "@" <> _} ->
        raise "foo"

      # legacy special cases
      msg = %{"op" => special_case} when special_case in @special_cases ->
        Broth.LegacyHandler.process(msg, state)

      {:error, %Jason.DecodeError{}} ->
        {:reply, {:close, 4001, "invalid input"}, state}

      # error validating the inner changeset.
      {:ok, error} ->
        reply =
          error
          |> Map.put(:operator, error.inbound_operator)
          |> prepare_socket_msg(state)

        {:reply, reply, state}

      {:error, changeset = %Ecto.Changeset{}} ->
        reply = %{errors: Kousa.Utils.Errors.changeset_errors(changeset)}
        {:reply, prepare_socket_msg(reply, state), state}
    end
  end

  import Ecto.Changeset

  def validate(message, state) do
    message
    |> Broth.Message.changeset(state)
    |> apply_action(:validate)
  end

  def dispatch(message, state) do
    case message.operator.execute(message.payload, state) do
      close = {:close, _, _} ->
        {:reply, close, state}

      {:error, changeset = %Ecto.Changeset{}} ->
        # hacky, we need to build a reverse lookup for the modules/operations.
        reply =
          message
          |> Map.merge(%{
            operator: message.inbound_operator,
            errors: Kousa.Utils.Errors.changeset_errors(changeset)
          })
          |> prepare_socket_msg(state)

        {:reply, reply, state}

      {:error, err} when is_binary(err) ->
        reply =
          message
          |> wrap_error(%{message: err})
          |> prepare_socket_msg(state)

        {:reply, reply, state}

      {:error, err} ->
        reply =
          message
          |> wrap_error(%{message: inspect(err)})
          |> prepare_socket_msg(state)

        {:reply, reply, state}

      {:error, errors, new_state} ->
        reply =
          message
          |> wrap_error(errors)
          |> prepare_socket_msg(new_state)

        {:reply, reply, new_state}

      {:noreply, new_state} ->
        {:ok, new_state}

      {:reply, payload, new_state} ->
        reply =
          message
          |> wrap(payload)
          |> prepare_socket_msg(new_state)

        {:reply, reply, new_state}
    end
  end

  def wrap(message, payload = %{}) do
    %{message | operator: message.inbound_operator <> ":reply", payload: payload}
  end

  def wrap_error(message, error_map) do
    %{message | payload: %{}, errors: error_map, operator: message.inbound_operator}
  end

  #def f_handler("search", %{"query" => query}, _state) do
  #  items = Kousa.Search.search(query)
#
  #  %{items: items, nextCursor: nil}
  #end

  def prepare_socket_msg(data, state) do
    data
    |> encode_data(state)
    |> prepare_data(state)
  end

  defp encode_data(data, %{encoding: :etf}) do
    data
    |> Map.from_struct()
    |> :erlang.term_to_binary()
  end

  defp encode_data(data, %{encoding: :json}) do
    Jason.encode!(data)
  end

  defp prepare_data(data, %{compression: :zlib}) do
    z = :zlib.open()

    :zlib.deflateInit(z)
    data = :zlib.deflate(z, data, :finish)
    :zlib.deflateEnd(z)

    {:binary, data}
  end

  defp prepare_data(data, %{encoding: :etf}) do
    {:binary, data}
  end

  defp prepare_data(data, %{encoding: :json}) do
    {:text, data}
  end
end

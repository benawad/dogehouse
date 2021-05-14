defmodule Onion.AudioPipeline do
  use Membrane.Pipeline

  alias Membrane.WebRTC.EndpointBin
  alias Membrane.WebRTC.Track
  alias Membrane.WebRTC.Endpoint
  alias Broth.SocketHandler

  require Membrane.Logger

  @pipeline_registry Onion.PipelineRegistry

  # pipeline has to be started before any peer connects with it
  # therefore there is a possibility that pipeline won't be ever closed
  # (a peer started it but failed to join) so set a timeout at pipeline's start to check
  # if anyone joined the room and close it if no one did
  @empty_room_timeout 5000

  @spec registry() :: atom()
  def registry(), do: @pipeline_registry

  @spec lookup(String.t()) :: GenServer.server() | nil
  def lookup(room_id) do
    case Registry.lookup(@pipeline_registry, room_id) do
      [{pid, _value}] -> pid
      [] -> nil
    end
  end

  @spec lookup_or_start(binary) :: any
  def lookup_or_start(room_id) do
    case lookup(room_id) do
      nil -> start(room_id)
      pid -> {:ok, pid}
    end
  end

  def start_link(room_id) do
    do_start(:start_link, room_id)
  end

  def start(room_id) do
    do_start(:start, room_id)
  end

  defp do_start(func, room_id) when func in [:start, :start_link] do
    Membrane.Logger.info("[Onion.AudioPipeline] Starting a new pipeline for room: #{room_id}")

    apply(Membrane.Pipeline, func, [
      __MODULE__,
      [room_id],
      [name: {:via, Registry, {@pipeline_registry, room_id}}]
    ])
  end

  @impl true
  def handle_init([room_id]) do
    play(self())

    Process.send_after(self(), :check_if_empty, @empty_room_timeout)

    max_display_num = Application.fetch_env!(:kousa, :max_room_size)

    {
      {:ok, log_metadata: [room: room_id]},
      # expects you not to use a struct
      %{
        room_id: room_id,
        endpoints: %{},
        max_display_num: max_display_num,
        peer_type: :speaker,
        pid_map: %BiMap{},
        new_speaker: %{}
      }
    }
  end

  def send_to_room(room_id, params) do
    with pid when not is_nil(pid) <- lookup(room_id) do
      send(pid, params)
    end
  end

  @spec change_peer_type(Ecto.UUID.t(), pid(), :speaker | :listener) :: nil
  def change_peer_type(room_id, peer_pid, peer_type) do
    send_to_room(room_id, {:change_peer_type, peer_pid, peer_type})
  end

  def signal(room_id, peer_pid, msg) do
    send_to_room(room_id, {:signal, peer_pid, msg})
  end

  def remove_peer(room_id, peer_pid) do
    send_to_room(room_id, {:remove_peer, peer_pid})
  end

  @spec new_peer(Ecto.UUID.t(), pid(), :speaker | :listener) :: nil
  def new_peer(room_id, peer_pid, peer_type) do
    send_to_room(room_id, {:new_peer, peer_pid, peer_type})
  end

  def new_peer_impl({peer_pid, peer_type}, ctx, state) do
    Membrane.Logger.info("New peer #{inspect(peer_pid)}")
    Process.monitor(peer_pid)

    # tracks = if(peer_type === :speaker, do: new_tracks(), else: [])
    tracks = new_tracks()

    endpoint_id = UUID.uuid4()
    endpoint = Endpoint.new(endpoint_id, :participant, tracks, %{})
    state = %{state | pid_map: BiMap.put(state.pid_map, peer_pid, endpoint_id)}
    endpoint_bin = {:endpoint, endpoint_id}

    children = %{
      endpoint_bin => %EndpointBin{
        outbound_tracks: get_all_tracks(state.endpoints),
        inbound_tracks: tracks,
        # I'm pretty sure this google
        stun_servers: [%{server_addr: {64, 233, 163, 127}, server_port: 19302}],
        turn_servers: [],
        handshake_opts: [
          client_mode: false,
          dtls_srtp: true,
          pkey: Application.get_env(:kousa, :dtls_pkey),
          cert: Application.get_env(:kousa, :dtls_cert)
        ],
        # TODO: change peer_pid to something that will easier identify peer when we introduce
        # participants labelling
        log_metadata: [peer: peer_pid]
      }
    }

    # @todo hard coded :speaker
    # (might actually be ok)
    links = new_peer_links(:speaker, endpoint_bin, ctx, state)

    tracks_msgs =
      if peer_type == :listener do
        []
      else
        flat_map_children(ctx, fn
          endpoint_bin ->
            [forward: {endpoint_bin, {:add_tracks, tracks}}]
        end)
      end

    spec = %ParentSpec{children: children, links: links}

    state = put_in(state.endpoints[endpoint_id], endpoint)

    {{:ok, [spec: spec] ++ tracks_msgs},
     %{state | peer_type: peer_type, new_speaker: Map.put(state.new_speaker, endpoint_id, true)}}
  end

  @impl true
  def handle_other({:new_peer, peer_pid, peer_type}, ctx, state) do
    endpoint_id = BiMap.get(state.pid_map, peer_pid)

    if Map.has_key?(ctx.children, {:endpoint, endpoint_id}) do
      Membrane.Logger.warn("Peer already connected, ignoring")
      {:ok, state}
    else
      new_peer_impl({peer_pid, peer_type}, ctx, state)
    end
  end

  # speaker -> listener or listener -> speaker
  @impl true
  def handle_other({:change_peer_type, peer_pid, peer_type}, ctx, state) do
    {_, remove_actions, new_state} = maybe_remove_peer(peer_pid, ctx, state)
    {{:ok, create_actions}, final_state} = new_peer_impl({peer_pid, peer_type}, ctx, new_state)

    {{:ok, remove_actions ++ create_actions}, final_state}
  end

  @impl true
  def handle_other({:signal, peer_pid, msg}, _ctx, state) do
    {{:ok, forward: {{:endpoint, BiMap.get(state.pid_map, peer_pid)}, {:signal, msg}}}, state}
  end

  def handle_other({:remove_peer, peer_pid}, ctx, state) do
    case maybe_remove_peer(peer_pid, ctx, state) do
      {:absent, [], state} ->
        Membrane.Logger.info("Peer #{inspect(peer_pid)} already removed")
        {:ok, state}

      {:present, actions, state} ->
        {{:ok, actions}, state}
    end
  end

  def handle_other({:DOWN, _ref, :process, pid, _reason}, ctx, state) do
    {_status, actions, state} = maybe_remove_peer(pid, ctx, state)

    stop_if_empty(state)

    {{:ok, actions}, state}
  end

  def handle_other(:check_if_empty, _ctx, state) do
    stop_if_empty(state)
    {:ok, state}
  end

  def handle_notification({:vad, _val}, {:endpoint, _endpoint_id}, _ctx, state) do
    {:ok, state}
  end

  @impl true
  def handle_notification({:new_track, track_id, encoding}, endpoint_bin, ctx, state) do
    Membrane.Logger.info("New incoming #{encoding} track #{track_id}")
    {:endpoint, endpoint_id} = endpoint_bin

    # endpoint = state.endpoints[endpoint_id]

    # track = Endpoint.get_track_byid(endpoint, track_id)

    tee = {:tee, {endpoint_id, track_id}}
    fake = {:fake, {endpoint_id, track_id}}

    children = %{
      tee => Membrane.Element.Tee.Parallel,
      fake => Membrane.Element.Fake.Sink.Buffers
    }

    links =
      [
        link(endpoint_bin)
        |> via_out(Pad.ref(:output, track_id))
        |> to(tee)
        |> to(fake)
      ] ++
        flat_map_children(ctx, fn
          {:endpoint, id} = other_endpoint
          when endpoint_id != id ->
            [
              link(tee)
              |> via_in(Pad.ref(:input, track_id),
                options: [encoding: encoding, track_enabled: true]
              )
              |> to(other_endpoint)
            ]

          _ ->
            []
        end)

    spec = %ParentSpec{children: children, links: links}

    state =
      update_in(
        state,
        [:endpoints, endpoint_id],
        &Endpoint.update_track_encoding(&1, track_id, encoding)
      )

    {{:ok, spec: spec}, state}
  end

  def handle_notification(
        {:signal, {:sdp_offer, sdp}},
        {:endpoint, endpoint_id},
        _ctx,
        state
      ) do
    peer_pid = BiMap.get_key(state.pid_map, endpoint_id)

    SocketHandler.remote_send(peer_pid, %{
      op: "webrtc:offer:in",
      d: %{
        data: %{"type" => "offer", "sdp" => sdp},
        peerType: if(state.peer_type == :speaker, do: "speaker", else: "listener"),
        roomId: state.room_id,
        isNewSpeaker: Map.has_key?(state.new_speaker, endpoint_id)
      }
    })

    {:ok, %{state | new_speaker: Map.delete(state.new_speaker, endpoint_id)}}
  end

  def handle_notification({:signal, message}, {:endpoint, endpoint_id}, _ctx, state) do
    peer_pid = BiMap.get_key(state.pid_map, endpoint_id)

    case message do
      {:candidate, candidate, sdp_mline_index} ->
        SocketHandler.remote_send(peer_pid, %{
          op: "webrtc:candidate:in",
          d: %{"candidate" => candidate, "sdpMLineIndex" => sdp_mline_index}
        })

      {:replace_track, old_track_id, new_track_id} ->
        %{"oldTrackId" => old_track_id, "newTrackId" => new_track_id}
    end

    {:ok, state}
  end

  defp maybe_remove_peer(peer_pid, ctx, state) do
    endpoint_id = BiMap.get(state.pid_map, peer_pid)
    endpoint = ctx.children[{:endpoint, endpoint_id}]

    if endpoint == nil or endpoint.terminating? do
      {:absent, [], state}
    else
      Membrane.Logger.info("Removing Peer #{inspect(peer_pid)}")
      {endpoint, state} = pop_in(state, [:endpoints, endpoint_id])
      tracks = Enum.map(Endpoint.get_tracks(endpoint), &%Track{&1 | enabled?: false})

      children =
        Endpoint.get_tracks(endpoint)
        |> Enum.map(fn track -> track.id end)
        |> Enum.flat_map(&[tee: {endpoint_id, &1}, fake: {endpoint_id, &1}])
        |> Enum.filter(&Map.has_key?(ctx.children, &1))

      children = [endpoint: endpoint_id] ++ children

      tracks_msgs =
        flat_map_children(ctx, fn
          {:endpoint, id} when id != endpoint_id ->
            [forward: {{:endpoint, id}, {:add_tracks, tracks}}]

          _child ->
            []
        end)

      {:present, [remove_child: children] ++ tracks_msgs, state}
    end
  end

  defp stop_if_empty(state) do
    if state.endpoints == %{} do
      Membrane.Logger.info("Room '#{state.room_id}' is empty, stopping pipeline")
      Membrane.Pipeline.stop_and_terminate(self())
    end
  end

  defp flat_map_children(ctx, fun) do
    ctx.children |> Map.keys() |> Enum.flat_map(fun)
  end

  defp new_tracks() do
    stream_id = Track.stream_id()
    Membrane.Logger.info("Creating new stream with id #{inspect(stream_id)}")
    [Track.new(:audio, stream_id)]
  end

  defp new_peer_links(
         :speaker,
         {:endpoint, _new_endpoint_id} = new_endpoint_bin,
         ctx,
         state
       ) do
    flat_map_children(ctx, fn
      {:tee, {endpoint_id, track_id}} = tee ->
        endpoint = state.endpoints[endpoint_id]

        if endpoint do
          track = Endpoint.get_track_by_id(endpoint, track_id)

          [
            link(tee)
            |> via_in(Pad.ref(:input, track_id),
              options: [encoding: track.encoding, track_enabled: true]
            )
            |> to(new_endpoint_bin)
          ]
        else
          []
        end

      _child ->
        []
    end)
  end

  defp get_all_tracks(endpoints),
    do: Enum.flat_map(endpoints, fn {_id, endpoint} -> Endpoint.get_tracks(endpoint) end)
end

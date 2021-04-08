defmodule Onion.RoomSession do
  use GenServer, restart: :temporary

  # TODO: change this.  Actually, make it an ecto thing.
  defmodule State do
    @type t :: %__MODULE__{
            room_id: String.t(),
            voice_server_id: String.t(),
            users: [String.t()],
            muteMap: map(),
            inviteMap: map(),
            activeSpeakerMap: map(),
            auto_speaker: boolean()
          }

    defstruct room_id: "",
              voice_server_id: "",
              users: [],
              muteMap: %{},
              inviteMap: %{},
              activeSpeakerMap: %{},
              auto_speaker: false
  end

  #################################################################################
  # REGISTRY AND SUPERVISION BOILERPLATE

  defp via(user_id), do: {:via, Registry, {Onion.RoomSessionRegistry, user_id}}

  defp cast(user_id, params), do: GenServer.cast(via(user_id), params)
  defp call(user_id, params), do: GenServer.call(via(user_id), params)

  def start_supervised(initial_values) do
    callers = [self() | Process.get(:"$callers", [])]

    case DynamicSupervisor.start_child(
           Onion.RoomSessionDynamicSupervisor,
           {__MODULE__, Keyword.merge(initial_values, callers: callers)}
         ) do
      {:error, {:already_started, pid}} -> {:ignored, pid}
      error -> error
    end
  end

  def child_spec(init), do: %{super(init) | id: Keyword.get(init, :room_id)}

  def count, do: Registry.count(Onion.RoomSessionRegistry)
  def lookup(room_id), do: Registry.lookup(Onion.RoomSessionRegistry, room_id)

  ###############################################################################
  ## INITIALIZATION BOILERPLATE

  def start_link(init) do
    IO.puts("room session starting: " <> init[:room_id])
    GenServer.start_link(__MODULE__, init, name: via(init[:room_id]))
  end

  def init(init) do
    # adopt callers from the call point.
    Process.put(:"$callers", init[:callers])

    # also launch a linked, supervised room.
    Onion.RoomChat.start_link_supervised(init[:room_id])
    {:ok, struct(State, init)}
  end

  ########################################################################
  ## API

  def ws_fan(users, msg) do
    Enum.each(users, fn uid ->
      Onion.UserSession.send_ws(uid, nil, msg)
    end)
  end

  def get(room_id, key), do: call(room_id, {:get, key})

  defp get_impl(key, _reply, state) do
    {:reply, Map.get(state, key), state}
  end

  def get_maps(room_id), do: call(room_id, :get_maps)

  defp get_maps_impl(_reply, state) do
    {:reply, {state.muteMap, state.auto_speaker, state.activeSpeakerMap}, state}
  end

  def redeem_invite(room_id, user_id), do: call(room_id, {:redeem_invite, user_id})

  defp redeem_invite_impl(user_id, _reply, state) do
    reply = if Map.has_key?(state.inviteMap, user_id), do: :ok, else: :error

    {:reply, reply, %{state | inviteMap: Map.delete(state.inviteMap, user_id)}}
  end

  def speaking_change(room_id, user_id, value) do
    cast(room_id, {:speaking_change, user_id, value})
  end

  defp speaking_change_impl(user_id, value, state) when is_boolean(value) do
    muteMap = if value, do: Map.delete(state.muteMap, user_id), else: state.muteMap

    newActiveSpeakerMap =
      if value,
        do: Map.put(state.activeSpeakerMap, user_id, true),
        else: Map.delete(state.activeSpeakerMap, user_id)

    ws_fan(state.users, %{
      op: "active_speaker_change",
      d: %{activeSpeakerMap: newActiveSpeakerMap, roomId: state.room_id, muteMap: muteMap}
    })

    {:noreply, %{state | activeSpeakerMap: newActiveSpeakerMap}}
  end

  def set_auto_speaker(room_id, value) when is_boolean(value) do
    cast(room_id, {:set_auto_speaker, value})
  end

  defp set_auto_speaker_impl(value, state) do
    {:noreply, %{state | auto_speaker: value}}
  end

  def broadcast_ws(room_id, msg), do: cast(room_id, {:broadcast_ws, msg})

  defp broadcast_ws_impl(msg, state) do
    ws_fan(state.users, msg)
    {:noreply, state}
  end

  def create_invite(room_id, user_id, user_info) do
    cast(room_id, {:create_invite, user_id, user_info})
  end

  defp create_invite_impl(user_id, user_info, state) do
    Onion.UserSession.send_ws(
      user_id,
      nil,
      %{
        op: "invitation_to_room",
        d:
          Map.merge(
            %{roomId: state.room_id},
            user_info
          )
      }
    )

    {:noreply,
     %{
       state
       | inviteMap: Map.put(state.inviteMap, user_id, true)
     }}
  end

  def remove_speaker(room_id, user_id), do: cast(room_id, {:remove_speaker, user_id})

  defp remove_speaker_impl(user_id, state) do
    new_mm = Map.delete(state.muteMap, user_id)

    Onion.VoiceRabbit.send(state.voice_server_id, %{
      op: "remove-speaker",
      d: %{roomId: state.room_id, peerId: user_id},
      uid: user_id
    })

    ws_fan(state.users, %{
      op: "speaker_removed",
      d: %{
        userId: user_id,
        roomId: state.room_id,
        muteMap: new_mm,
        raiseHandMap: %{}
      }
    })

    {:noreply, %State{state | muteMap: new_mm}}
  end

  def add_speaker(room_id, user_id, muted?) when is_boolean(muted?) do
    cast(room_id, {:add_speaker, user_id, muted?})
  end

  def add_speaker_impl(user_id, muted?, state) do
    new_mm =
      if muted?,
        do: Map.put(state.muteMap, user_id, true),
        else: Map.delete(state.muteMap, user_id)

    Onion.VoiceRabbit.send(state.voice_server_id, %{
      op: "add-speaker",
      d: %{roomId: state.room_id, peerId: user_id},
      uid: user_id
    })

    ws_fan(state.users, %{
      op: "speaker_added",
      d: %{
        userId: user_id,
        roomId: state.room_id,
        muteMap: new_mm
      }
    })

    {:noreply, %{state | muteMap: new_mm}}
  end

  def join_room(room_id, user_id, mute, opts \\ [])
      when is_boolean(mute) do
    cast(room_id, {:join_room, user_id, mute, opts})
  end

  defp join_room_impl(user_id, mute, opts, state) do
    Onion.RoomChat.add_user(state.room_id, user_id)

    # consider using MapSet instead!!
    muteMap =
      case mute do
        nil -> state.muteMap
        true -> Map.put(state.muteMap, user_id, true)
        false -> Map.delete(state.muteMap, user_id)
      end

    unless opts[:no_fan] do
      ws_fan(state.users, %{
        op: "new_user_join_room",
        d: %{
          user: Beef.Users.get_by_id_with_room_permissions(user_id),
          muteMap: muteMap,
          roomId: state.room_id
        }
      })
    end

    {:noreply,
     %{
       state
       | users: [
           # maybe use a set
           user_id
           | Enum.filter(state.users, fn uid -> uid != user_id end)
         ],
         muteMap: muteMap
     }}
  end

  def mute(room_id, user_id, value), do: cast(room_id, {:mute, user_id, value})

  defp mute_impl(user_id, value, state) do
    changed = value != Map.has_key?(state.muteMap, user_id)

    if changed do
      ws_fan(Enum.filter(state.users, &(&1 != user_id)), %{
        op: "mute_changed",
        d: %{userId: user_id, value: value, roomId: state.room_id}
      })
    end

    {:noreply,
     %{
       state
       | muteMap:
           if(not value,
             do: Map.delete(state.muteMap, user_id),
             else: Map.put(state.muteMap, user_id, true)
           ),
         activeSpeakerMap:
           if(value, do: Map.delete(state.activeSpeakerMap, user_id), else: state.activeSpeakerMap)
     }}
  end

  def destroy(room_id, user_id), do: cast(room_id, {:destroy, user_id})

  defp destroy_impl(user_id, state) do
    users = Enum.filter(state.users, fn uid -> uid != user_id end)

    ws_fan(users, %{
      op: "room_destroyed",
      d: %{roomId: state.room_id}
    })

    {:stop, :normal, state}
  end

  def kick_from_room(room_id, user_id), do: cast(room_id, {:kick_from_room, user_id})

  defp kick_from_room_impl(user_id, state) do
    users = Enum.filter(state.users, fn uid -> uid != user_id end)

    Onion.RoomChat.remove_user(state.room_id, user_id)

    Onion.VoiceRabbit.send(state.voice_server_id, %{
      op: "close-peer",
      uid: user_id,
      d: %{peerId: user_id, roomId: state.room_id, kicked: true}
    })

    ws_fan(users, %{
      op: "user_left_room",
      d: %{userId: user_id, roomId: state.room_id, kicked: true}
    })

    {:noreply,
     %{
       state
       | users: users,
         muteMap: Map.delete(state.muteMap, user_id)
     }}
  end

  def leave_room(room_id, user_id), do: cast(room_id, {:leave_room, user_id})

  defp leave_room_impl(user_id, state) do
    users = Enum.reject(state.users, &(&1 == user_id))

    Onion.RoomChat.remove_user(state.room_id, user_id)

    Onion.VoiceRabbit.send(state.voice_server_id, %{
      op: "close-peer",
      uid: user_id,
      d: %{peerId: user_id, roomId: state.room_id}
    })

    ws_fan(users, %{
      op: "user_left_room",
      d: %{userId: user_id, roomId: state.room_id}
    })

    new_state = %{
      state
      | users: users,
        muteMap: Map.delete(state.muteMap, user_id)
    }

    # terminate room if it's empty
    case new_state.users do
      [] ->
        {:stop, :normal, new_state}

      _ ->
        {:noreply, new_state}
    end
  end

  ########################################################################
  ## ROUTER

  def handle_call({:get, key}, reply, state), do: get_impl(key, reply, state)

  def handle_call(:get_maps, reply, state), do: get_maps_impl(reply, state)

  def handle_call({:redeem_invite, user_id}, reply, state) do
    redeem_invite_impl(user_id, reply, state)
  end

  def handle_cast({:kick_from_room, user_id}, state) do
    kick_from_room_impl(user_id, state)
  end

  def handle_cast({:speaking_change, user_id, value}, state) do
    speaking_change_impl(user_id, value, state)
  end

  def handle_cast({:set_auto_speaker, value}, state) do
    set_auto_speaker_impl(value, state)
  end

  def handle_cast({:broadcast_ws, msg}, state) do
    broadcast_ws_impl(msg, state)
  end

  def handle_cast({:create_invite, user_id, user_info}, state) do
    create_invite_impl(user_id, user_info, state)
  end

  def handle_cast({:remove_speaker, user_id}, state) do
    remove_speaker_impl(user_id, state)
  end

  def handle_cast({:add_speaker, user_id, muted?}, state) do
    add_speaker_impl(user_id, muted?, state)
  end

  def handle_cast({:join_room, user_id, mute, opts}, state) do
    join_room_impl(user_id, mute, opts, state)
  end

  def handle_cast({:mute, user_id, value}, state) do
    mute_impl(user_id, value, state)
  end

  def handle_cast({:destroy, user_id}, state) do
    destroy_impl(user_id, state)
  end

  def handle_cast({:leave_room, user_id}, state) do
    leave_room_impl(user_id, state)
  end
end

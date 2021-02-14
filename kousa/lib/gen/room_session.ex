defmodule Kousa.Gen.RoomSession do
  use GenServer

  defmodule State do
    @type t :: %__MODULE__{
            room_id: String.t(),
            users: [String.t()],
            muteMap: map(),
            raiseHandMap: map(),
            inviteMap: map(),
            activeSpeakerMap: map(),
            auto_speaker: boolean()
          }

    defstruct room_id: "",
              users: [],
              muteMap: %{},
              raiseHandMap: %{},
              inviteMap: %{},
              activeSpeakerMap: %{},
              auto_speaker: false
  end

  def start_link(%{room_id: room_id, user_id: user_id, muted: muted}) do
    GenServer.start_link(
      __MODULE__,
      %State{
        room_id: room_id,
        users: [user_id],
        auto_speaker: false,
        activeSpeakerMap: %{},
        muteMap: if(muted, do: Map.put(%{}, user_id, true), else: %{}),
        raiseHandMap: %{},
        inviteMap: %{}
      },
      name: :"#{room_id}:room_session"
    )
  end

  def init(x) do
    Kousa.Gen.RoomChat.start(x.room_id, %Kousa.Gen.RoomChat.State{
      room_id: x.room_id,
      users: x.users,
      ban_map: %{},
      last_message_map: %{}
    })

    {:ok, x}
  end

  @spec send_cast(String.t(), any) :: :ok
  def send_cast(room_id, params) do
    case GenRegistry.lookup(Kousa.Gen.RoomSession, room_id) do
      {:ok, session} ->
        GenServer.cast(session, params)

      err ->
        err
    end
  end

  def ws_fan(users, platform, msg) do
    Enum.each(users, fn uid ->
      Kousa.Gen.UserSession.send_cast(uid, {:send_ws_msg, platform, msg})
    end)
  end

  def handle_call({:get_mute_map}, _, state) do
    {:reply, {:ok, state.muteMap}, state}
  end

  def handle_call({:get_raise_hand_map}, _, state) do
    {:reply, {:ok, state.raiseHandMap}, state}
  end

  def handle_call({:get_maps}, _, state) do
    {:reply, {state.muteMap, state.raiseHandMap, state.auto_speaker}, state}
  end

  def handle_call({:has_raised_hand, user_id}, _, state) do
    {:reply, Map.has_key?(state.raiseHandMap, user_id), state}
  end

  def handle_call({:redeem_invite, user_id}, _, state) do
    if Map.has_key?(state.inviteMap, user_id) do
      {:reply, :ok,
       %{
         state
         | inviteMap: Map.delete(state.inviteMap, user_id)
       }}
    else
      {:reply, :error, state}
    end
  end

  def handle_call({:raise_hand, user_id}, _, state) do
    cond do
      state.auto_speaker ->
        {:reply, :speaker, state}

      Map.get(state.raiseHandMap, user_id) == 1 ->
        {:reply, :speaker, state}

      Map.has_key?(state.raiseHandMap, user_id) ->
        {:reply, :ok, state}

      true ->
        ws_fan(state.users, :vscode, %{
          op: "hand_raised",
          d: %{userId: user_id, roomId: state.room_id}
        })

        {:reply, :ok,
         %{
           state
           | raiseHandMap: Map.put(state.raiseHandMap, user_id, -1)
         }}
    end
  end

  def handle_cast({:speaking_change, user_id, value}, state) do
    bool = Kousa.Caster.bool(value)

    muteMap = if bool, do: Map.delete(state.muteMap, user_id), else: state.muteMap

    newActiveSpeakerMap =
      if bool,
        do: Map.put(state.activeSpeakerMap, user_id, true),
        else: Map.delete(state.activeSpeakerMap, user_id)

    ws_fan(state.users, :vscode, %{
      op: "active_speaker_change",
      d: %{activeSpeakerMap: newActiveSpeakerMap, roomId: state.room_id, muteMap: muteMap}
    })

    {:noreply, %{state | activeSpeakerMap: newActiveSpeakerMap}}
  end

  def handle_cast({:set_auto_speaker, value}, state) do
    bool =
      case value do
        true -> true
        _ -> false
      end

    {:noreply, %{state | auto_speaker: bool}}
  end

  def handle_cast({:send_ws_msg, platform, msg}, state) do
    ws_fan(state.users, platform, msg)

    {:noreply, state}
  end

  def handle_cast({:create_invite, user_id, displayName}, state) do
    Kousa.Gen.UserSession.send_cast(
      user_id,
      {:send_ws_msg, :vscode,
       %{op: "invitation_to_room", d: %{roomId: state.room_id, displayName: displayName}}}
    )

    {:noreply,
     %{
       state
       | inviteMap: Map.put(state.inviteMap, user_id, true)
     }}
  end

  def handle_cast({:speaker_removed, user_id}, %State{} = state) do
    new_mm = Map.delete(state.muteMap, user_id)
    new_rhm = Map.delete(state.raiseHandMap, user_id)

    ws_fan(state.users, :vscode, %{
      op: "speaker_removed",
      d: %{
        userId: user_id,
        roomId: state.room_id,
        muteMap: new_mm,
        raiseHandMap: new_rhm
      }
    })

    {:noreply, %State{state | muteMap: new_mm, raiseHandMap: new_rhm}}
  end

  def handle_cast({:speaker_added, user_id, muted}, state) do
    new_mm =
      if muted,
        do: Map.put(state.muteMap, user_id, true),
        else: Map.delete(state.muteMap, user_id)

    ws_fan(state.users, :vscode, %{
      op: "speaker_added",
      d: %{
        userId: user_id,
        roomId: state.room_id,
        muteMap: new_mm
      }
    })

    {:noreply, %{state | muteMap: new_mm}}
  end

  def handle_cast({:join_room, user, mute}, %State{} = state) do
    Kousa.RegUtils.lookup_and_cast(Kousa.Gen.RoomChat, state.room_id, {:add_user, user.id})

    muteMap =
      if is_nil(mute),
        do: state.muteMap,
        else:
          if(not Kousa.Caster.bool(mute),
            do: Map.delete(state.muteMap, user.id),
            else: Map.put(state.muteMap, user.id, true)
          )

    ws_fan(state.users, :vscode, %{op: "new_user_join_room", d: %{user: user, muteMap: muteMap}})

    {:noreply,
     %{
       state
       | users: [
           # maybe use a set
           user.id
           | Enum.filter(state.users, fn uid -> uid != user.id end)
         ],
         muteMap: muteMap
     }}
  end

  def handle_cast({:new_room_name, new_name}, %State{} = state) do
    ws_fan(state.users, :vscode, %{
      op: "new_room_name",
      d: %{name: new_name, roomId: state.room_id}
    })

    {:noreply, state}
  end

  def handle_cast({:answer_hand, user_id, value}, state) do
    {:noreply,
     %{
       state
       | raiseHandMap: Map.put(state.raiseHandMap, user_id, value)
     }}
  end

  def handle_cast({:mute, user_id, value}, state) do
    is_in_map = Map.has_key?(state.muteMap, user_id)
    changed = (not value and is_in_map) or (value and not is_in_map)

    if changed do
      ws_fan(Enum.filter(state.users, &(&1 != user_id)), :vscode, %{
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
           )
     }}
  end

  def handle_cast({:destroy, user_id}, state) do
    users = Enum.filter(state.users, fn uid -> uid != user_id end)
    Kousa.Gen.RoomChat.kill(state.room_id)

    ws_fan(users, :vscode, %{
      op: "room_destroyed",
      d: %{roomId: state.room_id}
    })

    {:stop, :normal, state}
  end

  def handle_cast({:leave_room, user_id}, %State{} = state) do
    users = Enum.filter(state.users, fn uid -> uid != user_id end)
    Kousa.RegUtils.lookup_and_cast(Kousa.Gen.RoomChat, state.room_id, {:remove_user, user_id})

    ws_fan(users, :vscode, %{
      op: "user_left_room",
      d: %{userId: user_id}
    })

    new_state = %{
      state
      | users: users,
        muteMap: Map.delete(state.muteMap, user_id)
    }

    if length(new_state.users) == 0 do
      Kousa.Gen.RoomChat.kill(state.room_id)
      {:stop, :normal, new_state}
    else
      {:noreply, new_state}
    end
  end
end

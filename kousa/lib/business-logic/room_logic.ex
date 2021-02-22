defmodule Kousa.BL.Room do
  use Kousa.Dec.Atomic
  alias Kousa.{Data, RegUtils, Gen, Caster, VoiceServerUtils}

  def set_auto_speaker(user_id, value) do
    room = Kousa.Data.Room.get_room_by_creator_id(user_id)

    if not is_nil(room) do
      Kousa.RegUtils.lookup_and_cast(Kousa.Gen.RoomSession, room.id, {:set_auto_speaker, value})
    end
  end

  @spec make_room_public(any, any) :: nil | :ok
  def make_room_public(user_id, new_name) do
    # this needs to be refactored if a user can have multiple rooms
    case Kousa.Data.Room.set_room_privacy_by_creator_id(user_id, false, new_name) do
      {1, [room]} ->
        Kousa.Gen.RoomSession.send_cast(
          room.id,
          {:send_ws_msg, :vscode,
           %{op: "room_privacy_change", d: %{roomId: room.id, name: room.name, isPrivate: false}}}
        )

      _ ->
        nil
    end
  end

  @spec make_room_private(any, any) :: nil | :ok
  def make_room_private(user_id, new_name) do
    # this needs to be refactored if a user can have multiple rooms
    case Kousa.Data.Room.set_room_privacy_by_creator_id(user_id, true, new_name) do
      {1, [room]} ->
        Kousa.Gen.RoomSession.send_cast(
          room.id,
          {:send_ws_msg, :vscode,
           %{op: "room_privacy_change", d: %{roomId: room.id, name: room.name, isPrivate: true}}}
        )

      _ ->
        nil
    end
  end

  def invite_to_room(user_id, user_id_to_invite) do
    user = Kousa.Data.User.get_by_id(user_id)

    if not is_nil(user.currentRoomId) and
         Kousa.Data.Follower.is_following_me(user_id, user_id_to_invite) do
      Kousa.Gen.RoomSession.send_cast(
        user.currentRoomId,
        # @todo someone could change displayName to fool the person
        {:create_invite, user_id_to_invite, user.displayName}
      )
    end
  end

  def block_from_room(user_id, user_id_to_block_from_room) do
    with {status, room} when status in [:creator, :mod] <-
           Kousa.Data.Room.get_room_status(user_id) do
      if room.creatorId != user_id_to_block_from_room do
        Kousa.Data.RoomBlock.insert(%{
          modId: user_id,
          userId: user_id_to_block_from_room,
          roomId: room.id
        })

        user_blocked = Kousa.Data.User.get_by_id(user_id_to_block_from_room)

        if user_blocked.currentRoomId == room.id do
          leave_room(user_id_to_block_from_room, user_blocked.currentRoomId, true)
        end
      end
    end
  end

  defp internal_set_listener(user_id_to_make_listener, room_id) do
    Data.RoomPermission.make_listener(user_id_to_make_listener, room_id)

    Kousa.RegUtils.lookup_and_cast(
      Kousa.Gen.RoomSession,
      room_id,
      {:speaker_removed, user_id_to_make_listener}
    )
  end

  def set_listener(user_id, user_id_to_set_listener) do
    if user_id == user_id_to_set_listener do
      internal_set_listener(
        user_id_to_set_listener,
        Kousa.Data.User.get_current_room_id(user_id_to_set_listener)
      )
    else
      {status, room} = Kousa.Data.Room.get_room_status(user_id)
      is_creator = user_id_to_set_listener == not is_nil(room) and room.creatorId

      if not is_creator and (status == :creator or status == :mod) do
        internal_set_listener(
          user_id_to_set_listener,
          Kousa.Data.User.get_current_room_id(user_id_to_set_listener)
        )
      end
    end
  end

  @spec internal_set_speaker(any, any) :: nil | :ok | {:err, {:error, :not_found}}
  def internal_set_speaker(user_id_to_make_speaker, room_id) do
    with {:ok, _} <-
           Kousa.Data.RoomPermission.set_is_speaker(user_id_to_make_speaker, room_id, true) do
      case GenRegistry.lookup(
             Kousa.Gen.RoomSession,
             room_id
           ) do
        {:ok, session} ->
          GenServer.cast(
            session,
            {:speaker_added, user_id_to_make_speaker,
             Kousa.Gen.UserSession.send_call!(user_id_to_make_speaker, {:get, :muted})}
          )

        err ->
          {:err, err}
      end
    end
  end

  def make_speaker(user_id, user_id_to_make_speaker) do
    with {status, room} when status in [:creator, :mod] <-
           Kousa.Data.Room.get_room_status(user_id) do
      internal_set_speaker(user_id_to_make_speaker, room.id)
    end
  end

  def change_mod(user_id, user_id_to_change, value) do
    room = Kousa.Data.Room.get_room_by_creator_id(user_id)

    if room do
      Kousa.Data.RoomPermission.set_is_mod(user_id_to_change, room.id, Caster.bool(value))

      Kousa.RegUtils.lookup_and_cast(
        Kousa.Gen.RoomSession,
        room.id,
        {:send_ws_msg, :vscode,
         %{
           op: "mod_changed",
           d: %{roomId: room.id, userId: user_id_to_change}
         }}
      )
    end
  end

  def join_vc_room(user_id, room, is_speaker \\ nil) do
    is_speaker =
      if is_nil(is_speaker),
        do:
          room.creatorId == user_id or
            Kousa.Data.RoomPermission.is_speaker(user_id, room.id),
        else: is_speaker

    op =
      if is_speaker,
        do: "join-as-speaker",
        else: "join-as-new-peer"

    Kousa.Gen.VoiceRabbit.send(room.voiceServerId, %{
      op: op,
      d: %{roomId: room.id, peerId: user_id},
      uid: user_id
    })
  end

  def rename_room(_user_id, new_name) when byte_size(new_name) > 255 do
    {:error, "name needs to be less than 255 characters"}
  end

  def rename_room(user_id, new_name) do
    with {:ok, room_id} <- Data.User.tuple_get_current_room_id(user_id),
         {1, _} <- Data.Room.update_name(user_id, new_name) do
      nil
      RegUtils.lookup_and_cast(Gen.RoomSession, room_id, {:new_room_name, new_name})
    end
  end

  # @decorate user_atomic()
  def create_room(user_id, room_name, is_private) do
    room_id = Kousa.Data.User.get_current_room_id(user_id)

    if not is_nil(room_id) do
      leave_room(user_id, room_id)
    end

    id = Ecto.UUID.generate()

    case Data.Room.create(%{
           id: id,
           name: room_name,
           creatorId: user_id,
           numPeopleInside: 1,
           voiceServerId: VoiceServerUtils.get_next_voice_server_id(),
           isPrivate: is_private
         }) do
      {:ok, room} ->
        GenRegistry.lookup_or_start(
          Kousa.Gen.RoomSession,
          id,
          [
            %{
              room_id: id,
              user_id: user_id,
              voice_server_id: room.voiceServerId,
              muted: Kousa.Gen.UserSession.send_call!(user_id, {:get, :muted})
            }
          ]
        )

        Kousa.Gen.VoiceRabbit.send(room.voiceServerId, %{
          op: "create-room",
          d: %{roomId: id},
          uid: user_id
        })

        join_vc_room(user_id, room, true)
        {:ok, %{room: room}}

      {:error, x} ->
        {:error, Kousa.Errors.changeset_to_first_err_message(x)}
    end
  end

  # @decorate user_atomic()
  def join_room(user_id, room_id) do
    currentRoomId = Kousa.Data.User.get_current_room_id(user_id)

    if currentRoomId == room_id do
      %{room: Kousa.Data.Room.get_room_by_id(room_id)}
    else
      case Kousa.Data.Room.can_join_room(room_id, user_id) do
        {:error, message} ->
          %{error: message}

        {:ok, room} ->
          private_check =
            if room.isPrivate do
              case Kousa.RegUtils.lookup_and_call(
                     Kousa.Gen.RoomSession,
                     room.id,
                     {:redeem_invite, user_id}
                   ) do
                {:ok, :error} -> {:err, "the room is private, ask someone inside to invite you"}
                {:ok, :ok} -> {:ok}
                _ -> {:err, "room session doesn't exist"}
              end
            else
              {:ok}
            end

          case private_check do
            {:err, m} ->
              %{error: m}

            _ ->
              if currentRoomId do
                leave_room(user_id, currentRoomId)
              end

              updated_user = Kousa.Data.Room.join_room(room, user_id)

              Kousa.Gen.RoomSession.send_cast(
                room_id,
                {:join_room, updated_user,
                 Kousa.Gen.UserSession.send_call!(user_id, {:get, :muted})}
              )

              canSpeak =
                with %{roomPermissions: %{isSpeaker: true}} <- updated_user do
                  true
                else
                  _ ->
                    false
                end

              join_vc_room(user_id, room, canSpeak || room.isPrivate)
              %{room: room}
          end
      end
    end
  end

  def leave_room(user_id, current_room_id \\ nil, blocked \\ false) do
    current_room_id =
      if is_nil(current_room_id),
        do: Kousa.Data.User.get_current_room_id(user_id),
        else: current_room_id

    if current_room_id do
      case Kousa.Data.Room.leave_room(user_id, current_room_id) do
        # the room should be destroyed
        {:bye, room} ->
          Kousa.Gen.RoomSession.send_cast(current_room_id, {:destroy, user_id})

          Kousa.Gen.VoiceRabbit.send(room.voiceServerId, %{
            op: "destroy-room",
            uid: user_id,
            d: %{peerId: user_id, roomId: current_room_id}
          })

        # the room stays alive with new room creator
        x ->
          case x do
            {:new_creator_id, creator_id} ->
              Kousa.Gen.RoomSession.send_cast(
                current_room_id,
                {:send_ws_msg, :vscode,
                 %{op: "new_room_creator", d: %{roomId: current_room_id, userId: creator_id}}}
              )

            _ ->
              nil
          end

          Kousa.Gen.RoomSession.send_cast(
            current_room_id,
            {:leave_room, user_id}
          )
      end

      Kousa.Gen.UserSession.send_cast(
        user_id,
        {:send_ws_msg, :web,
         %{op: "you_left_room", d: %{roomId: current_room_id, blocked: blocked}}}
      )
    end
  end
end

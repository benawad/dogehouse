defmodule Kousa.Room do
  alias Kousa.Utils.RegUtils
  alias Kousa.Utils.VoiceServerUtils
  alias Beef.Users
  alias Beef.Follows
  alias Beef.Rooms
  # note the following 2 module aliases are on the chopping block!
  alias Beef.RoomPermissions
  alias Beef.RoomBlocks

  def set_auto_speaker(user_id, value) do
    room = Rooms.get_room_by_creator_id(user_id)

    if not is_nil(room) do
      RegUtils.lookup_and_cast(Onion.RoomSession, room.id, {:set_auto_speaker, value})
    end
  end

  @spec make_room_public(any, any) :: nil | :ok
  def make_room_public(user_id, new_name) do
    # this needs to be refactored if a user can have multiple rooms
    case Beef.Rooms.set_room_privacy_by_creator_id(user_id, false, new_name) do
      {1, [room]} ->
        Onion.RoomSession.send_cast(
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
    case Rooms.set_room_privacy_by_creator_id(user_id, true, new_name) do
      {1, [room]} ->
        Onion.RoomSession.send_cast(
          room.id,
          {:send_ws_msg, :vscode,
           %{op: "room_privacy_change", d: %{roomId: room.id, name: room.name, isPrivate: true}}}
        )

      _ ->
        nil
    end
  end

  def invite_to_room(user_id, user_id_to_invite) do
    user = Beef.Users.get_by_id(user_id)

    if not is_nil(user.currentRoomId) and
         Follows.following_me?(user_id, user_id_to_invite) do
      # @todo store room name in RoomSession to avoid db lookups
      room = Rooms.get_room_by_id(user.currentRoomId)

      if not is_nil(room) do
        Onion.RoomSession.send_cast(
          user.currentRoomId,
          {:create_invite, user_id_to_invite,
           %{
             roomName: room.name,
             displayName: user.displayName,
             username: user.username,
             avatarUrl: user.avatarUrl,
             type: "invite"
           }}
        )
      end
    end
  end

  def block_from_room(user_id, user_id_to_block_from_room) do
    with {status, room} when status in [:creator, :mod] <-
           Rooms.get_room_status(user_id) do
      if room.creatorId != user_id_to_block_from_room do
        RoomBlocks.insert(%{
          modId: user_id,
          userId: user_id_to_block_from_room,
          roomId: room.id
        })

        user_blocked = Beef.Users.get_by_id(user_id_to_block_from_room)

        if user_blocked.currentRoomId == room.id do
          leave_room(user_id_to_block_from_room, user_blocked.currentRoomId, true)
        end
      end
    end
  end

  defp internal_set_listener(user_id_to_make_listener, room_id) do
    RoomPermissions.make_listener(user_id_to_make_listener, room_id)

    Kousa.Utils.RegUtils.lookup_and_cast(
      Onion.RoomSession,
      room_id,
      {:speaker_removed, user_id_to_make_listener}
    )
  end

  def set_listener(user_id, user_id_to_set_listener) do
    if user_id == user_id_to_set_listener do
      internal_set_listener(
        user_id_to_set_listener,
        Beef.Users.get_current_room_id(user_id_to_set_listener)
      )
    else
      {status, room} = Rooms.get_room_status(user_id)
      is_creator = user_id_to_set_listener == not is_nil(room) and room.creatorId

      if not is_creator and (status == :creator or status == :mod) do
        internal_set_listener(
          user_id_to_set_listener,
          Beef.Users.get_current_room_id(user_id_to_set_listener)
        )
      end
    end
  end

  @spec internal_set_speaker(any, any) :: nil | :ok | {:err, {:error, :not_found}}
  def internal_set_speaker(user_id_to_make_speaker, room_id) do
    with {:ok, _} <-
           RoomPermissions.set_speaker?(user_id_to_make_speaker, room_id, true) do
      case GenRegistry.lookup(
             Onion.RoomSession,
             room_id
           ) do
        {:ok, session} ->
          GenServer.cast(
            session,
            {:speaker_added, user_id_to_make_speaker,
             Onion.UserSession.send_call!(user_id_to_make_speaker, {:get, :muted})}
          )

        err ->
          {:err, err}
      end
    end
  end

  def make_speaker(user_id, user_id_to_make_speaker) do
    with {status, room} when status in [:creator, :mod] <-
           Rooms.get_room_status(user_id) do
      internal_set_speaker(user_id_to_make_speaker, room.id)
    end
  end

  def change_mod(user_id, user_id_to_change, value) when is_boolean(value) do
    room = Rooms.get_room_by_creator_id(user_id)

    if room do
      RoomPermissions.set_is_mod(user_id_to_change, room.id, value)

      Kousa.Utils.RegUtils.lookup_and_cast(
        Onion.RoomSession,
        room.id,
        {:send_ws_msg, :vscode,
         %{
           op: "mod_changed",
           d: %{roomId: room.id, userId: user_id_to_change}
         }}
      )
    end
  end

  def change_room_creator(old_creator_id, new_creator_id, current_room_id \\ nil) do
    # get current room id
    current_room_id =
      if is_nil(current_room_id),
        do: Beef.Users.get_current_room_id(new_creator_id),
        else: current_room_id

    # get old creator's room id for validation
    old_creator_room_id = Beef.Users.get_current_room_id(old_creator_id)

    # validate
    case {is_nil(current_room_id), new_creator_id == old_creator_id,
          current_room_id == old_creator_room_id} do
      {false, false, true} ->
        case Rooms.replace_room_owner(old_creator_id, new_creator_id) do
          {1, _} ->
            internal_set_speaker(old_creator_id, current_room_id)
            Onion.RoomSession.send_cast(
              current_room_id,
              {:send_ws_msg, :vscode,
               %{op: "new_room_creator", d: %{roomId: current_room_id, userId: new_creator_id}}}
            )

          _ ->
            nil
        end

      _ ->
        nil
    end
  end

  def join_vc_room(user_id, room, speaker? \\ nil) do
    speaker? =
      if is_nil(speaker?),
        do:
          room.creatorId == user_id or
            RoomPermissions.speaker?(user_id, room.id),
        else: speaker?

    op =
      if speaker?,
        do: "join-as-speaker",
        else: "join-as-new-peer"

    Onion.VoiceRabbit.send(room.voiceServerId, %{
      op: op,
      d: %{roomId: room.id, peerId: user_id},
      uid: user_id
    })
  end

  def edit_room(user_id, new_name, new_description, is_private) do
    with {:ok, room_id} <- Users.tuple_get_current_room_id(user_id) do
      case Rooms.edit(room_id, %{
             name: new_name,
             description: new_description,
             is_private: is_private
           }) do
        {:ok, _room} ->
          RegUtils.lookup_and_cast(
            Onion.RoomSession,
            room_id,
            {:new_room_details, new_name, new_description, is_private}
          )

        {:error, x} ->
          {:error, Kousa.Utils.Errors.changeset_to_first_err_message_with_field_name(x)}
      end
    end
  end

  @spec create_room(String.t(), String.t(), String.t(), boolean(), String.t() | nil) ::
          {:error, any}
          | {:ok, %{room: atom | %{:id => any, :voiceServerId => any, optional(any) => any}}}
  def create_room(user_id, room_name, room_description, is_private, user_id_to_invite \\ nil) do
    room_id = Users.get_current_room_id(user_id)

    if not is_nil(room_id) do
      leave_room(user_id, room_id)
    end

    id = Ecto.UUID.generate()

    case Rooms.create(%{
           id: id,
           name: room_name,
           description: room_description,
           creatorId: user_id,
           numPeopleInside: 1,
           voiceServerId: VoiceServerUtils.get_next_voice_server_id(),
           isPrivate: is_private
         }) do
      {:ok, room} ->
        {:ok, session} =
          GenRegistry.lookup_or_start(
            Onion.RoomSession,
            id,
            [
              %{
                room_id: id,
                voice_server_id: room.voiceServerId
              }
            ]
          )

        GenServer.cast(
          session,
          {:join_room_no_fan, user_id, Onion.UserSession.send_call!(user_id, {:get, :muted})}
        )

        Onion.VoiceRabbit.send(room.voiceServerId, %{
          op: "create-room",
          d: %{roomId: id},
          uid: user_id
        })

        join_vc_room(user_id, room, true)

        if not is_private do
          Kousa.Follow.notify_followers_you_created_a_room(user_id, room)
        end

        if not is_nil(user_id_to_invite) do
          Task.start(fn ->
            Kousa.Room.invite_to_room(user_id, user_id_to_invite)
          end)
        end

        {:ok, %{room: room}}

      {:error, x} ->
        {:error, Kousa.Utils.Errors.changeset_to_first_err_message_with_field_name(x)}
    end
  end

  def join_room(user_id, room_id) do
    currentRoomId = Beef.Users.get_current_room_id(user_id)

    if currentRoomId == room_id do
      %{room: Rooms.get_room_by_id(room_id)}
    else
      case Rooms.can_join_room(room_id, user_id) do
        {:error, message} ->
          %{error: message}

        {:ok, room} ->
          private_check =
            if room.isPrivate do
              case Kousa.Utils.RegUtils.lookup_and_call(
                     Onion.RoomSession,
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

              updated_user = Rooms.join_room(room, user_id)

              Onion.RoomSession.send_cast(
                room_id,
                {:join_room, updated_user, Onion.UserSession.send_call!(user_id, {:get, :muted})}
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
        do: Beef.Users.get_current_room_id(user_id),
        else: current_room_id

    if current_room_id do
      case Rooms.leave_room(user_id, current_room_id) do
        # the room should be destroyed
        {:bye, room} ->
          Onion.RoomSession.send_cast(current_room_id, {:destroy, user_id})

          Onion.VoiceRabbit.send(room.voiceServerId, %{
            op: "destroy-room",
            uid: user_id,
            d: %{peerId: user_id, roomId: current_room_id}
          })

        # the room stays alive with new room creator
        x ->
          case x do
            {:new_creator_id, creator_id} ->
              Onion.RoomSession.send_cast(
                current_room_id,
                {:send_ws_msg, :vscode,
                 %{op: "new_room_creator", d: %{roomId: current_room_id, userId: creator_id}}}
              )

            _ ->
              nil
          end

          Onion.RoomSession.send_cast(
            current_room_id,
            {:leave_room, user_id}
          )
      end

      Onion.UserSession.send_cast(
        user_id,
        {:send_ws_msg, :web,
         %{op: "you_left_room", d: %{roomId: current_room_id, blocked: blocked}}}
      )
    end
  end
end

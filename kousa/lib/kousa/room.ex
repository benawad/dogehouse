defmodule Kousa.Room do
  alias Kousa.Utils.VoiceServerUtils
  alias Beef.Users
  alias Beef.Follows
  alias Beef.Rooms
  # note the following 2 module aliases are on the chopping block!
  alias Beef.RoomPermissions
  alias Beef.RoomBlocks
  alias Onion.PubSub
  alias Onion.UserSession
  alias Broth.SocketHandler

  def set_auto_speaker(user_id, value) do
    if room = Rooms.get_room_by_creator_id(user_id) do
      Onion.RoomSession.set_auto_speaker(room.id, value)
    end
  end

  @spec make_room_public(any, any) :: nil | :ok
  def make_room_public(user_id, new_name) do
    # this needs to be refactored if a user can have multiple rooms
    case Beef.Rooms.set_room_privacy_by_creator_id(user_id, false, new_name) do
      {1, [room]} ->
        Onion.RoomSession.broadcast_ws(
          room.id,
          %{op: "room_privacy_change", d: %{roomId: room.id, name: room.name, isPrivate: false}}
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
        Onion.RoomSession.broadcast_ws(
          room.id,
          %{op: "room_privacy_change", d: %{roomId: room.id, name: room.name, isPrivate: true}}
        )

      _ ->
        nil
    end
  end

  def invite_to_room(user_id, user_id_to_invite) do
    user = Beef.Users.get_by_id(user_id)

    if user.currentRoomId && Follows.following_me?(user_id, user_id_to_invite) do
      # @todo store room name in RoomSession to avoid db lookups
      room = Rooms.get_room_by_id(user.currentRoomId)

      if not is_nil(room) do
        Onion.RoomSession.create_invite(
          user.currentRoomId,
          user_id_to_invite,
          %{
            roomName: room.name,
            displayName: user.displayName,
            username: user.username,
            avatarUrl: user.avatarUrl,
            bannerUrl: user.bannerUrl,
            type: "invite"
          }
        )
      end
    end
  end

  defp internal_kick_from_room(user_id_to_kick, room_id) do
    case UserSession.lookup(user_id_to_kick) do
      [{_, _}] ->
        ws_pid = UserSession.get(user_id_to_kick, :pid)

        if ws_pid do
          SocketHandler.unsub(ws_pid, "chat:" <> room_id)
        end

      _ ->
        nil
    end

    current_room_id = Beef.Users.get_current_room_id(user_id_to_kick)

    if current_room_id == room_id do
      Rooms.kick_from_room(user_id_to_kick, current_room_id)
      Onion.RoomSession.kick_from_room(current_room_id, user_id_to_kick)
    end
  end

  @spec block_from_room(String.t(), String.t(), boolean()) ::
          nil
          | :ok
          | {:askedToSpeak | :creator | :listener | :mod | nil | :speaker,
             atom | %{:creatorId => any, optional(any) => any}}
  def block_from_room(user_id, user_id_to_block_from_room, should_ban_ip \\ false) do
    with {status, room} when status in [:creator, :mod] <-
           Rooms.get_room_status(user_id) do
      if room.creatorId != user_id_to_block_from_room do
        RoomBlocks.upsert(%{
          modId: user_id,
          userId: user_id_to_block_from_room,
          roomId: room.id,
          ip: if(should_ban_ip, do: Users.get_ip(user_id_to_block_from_room), else: nil)
        })

        internal_kick_from_room(user_id_to_block_from_room, room.id)
      end
    end
  end

  ###################################################################
  ## AUTH

  @doc """
  sets the authorization level of the user in the room that they're in.
  This could be 'user', 'mod', or 'owner'.

  Authorization to do so is pulled from the options `:by` keyword.

  TODO: move room into the opts field, and have it be passed in by the
  socket.
  """
  def set_auth(user_id, auth, opts) do
    room_id = Beef.Users.get_current_room_id(user_id)

    case auth do
      _ when is_nil(room_id) ->
        :noop

      :owner ->
        set_owner(room_id, user_id, opts[:by])

      :mod ->
        set_mod(room_id, user_id, opts[:by])

      :user ->
        set_user(room_id, user_id, opts[:by])
    end
  end

  ####################################################################
  # owner

  def set_owner(room_id, user_id, setter_id) do
    with {:creator, _} <- Rooms.get_room_status(setter_id), {1, _} <- Rooms.replace_room_owner(setter_id, user_id) do
      Onion.RoomSession.set_room_creator_id(room_id, user_id)
      internal_set_speaker(setter_id, room_id)

      Onion.RoomSession.broadcast_ws(
        room_id,
        %{
          op: "new_room_creator",
          d: %{roomId: room_id, userId: user_id}
        }
      )
    end
  end

  ####################################################################
  # mod

  # only creators can set someone to be mod.
  defp set_mod(room_id, user_id, setter_id) do
    # TODO: refactor this to pull from preloads.
    case Rooms.get_room_status(setter_id) do
      {:creator, _} ->
        RoomPermissions.set_is_mod(user_id, room_id, true)

        Onion.Chat.set_can_chat(room_id, user_id)

        Onion.RoomSession.broadcast_ws(
          room_id,
          %{
            op: "mod_changed",
            d: %{roomId: room_id, userId: user_id, isMod: true}
          }
        )

      _ ->
        :noop
    end
  end

  ####################################################################
  # plain user

  # mods can demote their own mod status.
  defp set_user(room_id, user_id, user_id) do
    case Rooms.get_room_status(user_id) do
      {:mod, _} ->
        RoomPermissions.set_is_mod(user_id, room_id, true)

        Onion.RoomSession.broadcast_ws(
          room_id,
          %{
            op: "mod_changed",
            d: %{roomId: room_id, userId: user_id, isMod: false}
          }
        )

      _ ->
        :noop
    end
  end

  # only creators can demote mods
  defp set_user(room_id, user_id, setter_id) do
    case Rooms.get_room_status(setter_id) do
      {:creator, _} ->
        RoomPermissions.set_is_mod(user_id, room_id, false)

        Onion.RoomSession.broadcast_ws(
          room_id,
          %{
            op: "mod_changed",
            d: %{roomId: room_id, userId: user_id, isMod: false}
          }
        )

      _ ->
        :noop
    end
  end

  ####################################################################
  ## ROLE

  @doc """
  sets the role of the user in the room that they're in.  Authorization
  to do so is pulled from the options `:by` keyword.

  TODO: move room into the opts field, and have it be passed in by the
  socket.
  """
  def set_role(user_id, role, opts) do
    room_id = Beef.Users.get_current_room_id(user_id)

    case role do
      _ when is_nil(room_id) ->
        :noop

      :listener ->
        set_listener(room_id, user_id, opts[:by])

      :speaker ->
        set_speaker(room_id, user_id, opts[:by])

      :raised_hand ->
        set_raised_hand(room_id, user_id, opts[:by])
    end
  end

  ####################################################################
  ## listener

  defp set_listener(nil, _, _), do: :noop
  # you are always allowed to set yourself as listener
  defp set_listener(room_id, user_id, user_id) do
    internal_set_listener(user_id, room_id)
  end

  defp set_listener(room_id, user_id, setter_id) do
    # TODO: refactor this to be simpler.  The list of
    # creators and mods should be in the preloads of the room.
    with {auth, _} <- Rooms.get_room_status(setter_id),
         {role, _} <- Rooms.get_room_status(user_id) do
      if auth == :creator or (auth == :mod and role not in [:creator, :mod]) do
        internal_set_listener(user_id, room_id)
      end
    end
  end

  defp internal_set_listener(user_id, room_id) do
    RoomPermissions.make_listener(user_id, room_id)
    Onion.RoomSession.remove_speaker(room_id, user_id)
  end

  ####################################################################
  ## speaker

  defp set_speaker(nil, _, _), do: :noop

  defp set_speaker(room_id, user_id, setter_id) do
    if not RoomPermissions.asked_to_speak?(user_id, room_id) do
      :noop
    else
      case Rooms.get_room_status(setter_id) do
        {_, nil} ->
          :noop

        {:mod, _} ->
          internal_set_speaker(user_id, room_id)

        {:creator, _} ->
          internal_set_speaker(user_id, room_id)

        {_, _} ->
          :noop
      end
    end
  end

  @spec internal_set_speaker(any, any) :: nil | :ok | {:err, {:error, :not_found}}
  defp internal_set_speaker(user_id, room_id) do
    case RoomPermissions.set_speaker(user_id, room_id, true) do
      {:ok, _} ->
        Onion.Chat.set_can_chat(room_id, user_id)
        # kind of horrible to have to make a double genserver call
        # here, we'll have to think about how this works (who owns muting)
        Onion.RoomSession.add_speaker(
          room_id,
          user_id,
          Onion.UserSession.get(user_id, :muted),
          Onion.UserSession.get(user_id, :deafened)
        )

      err ->
        {:err, err}
    end
  catch
    _, _ ->
      {:error, "room not found"}
  end

  # only you can raise your own hand
  defp set_raised_hand(room_id, user_id, setter_id) do
    if user_id == setter_id do
      if Onion.RoomSession.get(room_id, :auto_speaker) do
        internal_set_speaker(user_id, room_id)
      else
        case RoomPermissions.ask_to_speak(user_id, room_id) do
          {:ok, %{isSpeaker: true}} ->
            internal_set_speaker(user_id, room_id)

          _ ->
            Onion.RoomSession.broadcast_ws(
              room_id,
              %{
                op: "hand_raised",
                d: %{userId: user_id, roomId: room_id}
              }
            )
        end
      end
    end
  end

  ######################################################################
  ## UPDATE

  def update(user_id, data) do
    if room = Rooms.get_room_by_creator_id(user_id) do
      case Rooms.edit(room.id, data) do
        ok = {:ok, room} ->
          Onion.RoomSession.broadcast_ws(room.id, %{
            op: "new_room_details",
            d: %{
              name: room.name,
              description: room.description,
              chatThrottle: room.chatThrottle,
              isPrivate: room.isPrivate,
              roomId: room.id
            }
          })

          ok

        error = {:error, _} ->
          error
      end
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

  @spec create_room(
          String.t(),
          String.t(),
          String.t(),
          boolean(),
          String.t() | nil,
          boolean() | nil
        ) ::
          {:error, any}
          | {:ok, %{room: atom | %{:id => any, :voiceServerId => any, optional(any) => any}}}
  def create_room(
        user_id,
        room_name,
        room_description,
        is_private,
        user_id_to_invite \\ nil,
        auto_speaker \\ nil
      ) do
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
        Onion.RoomSession.start_supervised(
          room_id: room.id,
          voice_server_id: room.voiceServerId,
          auto_speaker: auto_speaker,
          chat_throttle: room.chatThrottle,
          chat_mode: room.chatMode,
          room_creator_id: room.creatorId
        )

        muted? = Onion.UserSession.get(user_id, :muted)
        deafened? = Onion.UserSession.get(user_id, :deafened)

        Onion.RoomSession.join_room(room.id, user_id, muted?, deafened?, no_fan: true)

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
          # TODO: change this to Task.Supervised
          Task.start(fn ->
            Kousa.Room.invite_to_room(user_id, user_id_to_invite)
          end)
        end

        # subscribe to this room's chat
        Onion.PubSub.subscribe("chat:" <> id)

        {:ok, %{room: room}}

      {:error, x} ->
        {:error, Kousa.Utils.Errors.changeset_to_first_err_message_with_field_name(x)}
    end
  end

  # NB this function does not correctly return an updated room struct if the
  # action is valid.

  # NB2, this function has an non-idiomatic parameter order.  room_id should
  # come first.
  def join_room(user_id, room_id) do
    currentRoomId = Beef.Users.get_current_room_id(user_id)

    if currentRoomId == room_id do
      %{room: Rooms.get_room_by_id(room_id)}
    else
      case Rooms.can_join_room(room_id, user_id) do
        {:error, message} ->
          %{error: message}

        {:ok, room} ->
          # private rooms can now be joined by anyone who has the link
          # they are functioning closer to an "unlisted" room
          if currentRoomId do
            leave_room(user_id, currentRoomId)
          end

          # subscribe to the new room chat
          PubSub.subscribe("chat:" <> room_id)

          updated_user = Rooms.join_room(room, user_id)

          {muted, deafened} =
            case Onion.UserSession.lookup(user_id) do
              [{_, _}] ->
                {
                  Onion.UserSession.get(user_id, :muted),
                  Onion.UserSession.get(user_id, :deafened)
                }

              _ ->
                {false, false}
            end

          Onion.RoomSession.join_room(room_id, user_id, muted, deafened)

          canSpeak =
            case updated_user do
              %{roomPermissions: %{isSpeaker: true}} -> true
              _ -> false
            end

          join_vc_room(user_id, room, canSpeak || room.isPrivate)
          %{room: room}
      end
    end
  catch
    _, _ ->
      {:error, "that room doesn't exist"}
  end

  def leave_room(user_id, current_room_id \\ nil) do
    current_room_id =
      if is_nil(current_room_id),
        do: Beef.Users.get_current_room_id(user_id),
        else: current_room_id

    if current_room_id do
      case Rooms.leave_room(user_id, current_room_id) do
        # the room should be destroyed
        {:bye, room} ->
          Onion.RoomSession.destroy(current_room_id, user_id)

          Onion.VoiceRabbit.send(room.voiceServerId, %{
            op: "destroy-room",
            uid: user_id,
            d: %{peerId: user_id, roomId: current_room_id}
          })

        # the room stays alive with new room creator
        x ->
          case x do
            {:new_creator_id, creator_id} ->
              Onion.RoomSession.broadcast_ws(
                current_room_id,
                %{op: "new_room_creator", d: %{roomId: current_room_id, userId: creator_id}}
              )

            _ ->
              nil
          end

          Onion.RoomSession.leave_room(current_room_id, user_id)
      end

      # unsubscribe to the room chat
      PubSub.unsubscribe("chat:" <> current_room_id)

      {:ok, %{roomId: current_room_id}}
    else
      {:error, "you are not in a room"}
    end
  end
end

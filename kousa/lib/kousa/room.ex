defmodule Kousa.Room do
  alias Kousa.Utils.VoiceServerUtils
  alias Beef.Users
  alias Beef.Follows
  alias Beef.Rooms
  # note the following 2 module aliases are on the chopping block!
  alias Beef.RoomPermissions
  alias Beef.RoomBlocks

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
            type: "invite"
          }
        )
      end
    end
  end

  defp internal_kick_from_room(user_id_to_kick, room_id) do
    current_room_id = Beef.Users.get_current_room_id(user_id_to_kick)

    if current_room_id == room_id do
      Rooms.kick_from_room(user_id_to_kick, current_room_id)
      Onion.RoomSession.kick_from_room(current_room_id, user_id_to_kick)
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
    with {:creator, _} <- Rooms.get_room_status(setter_id),
         {1, _} <- Rooms.replace_room_owner(setter_id, user_id) do
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

        Onion.RoomSession.broadcast_ws(
          room_id,
          %{
            op: "mod_changed",
            d: %{roomId: room_id, userId: user_id}
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
            d: %{roomId: room_id, userId: user_id}
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
            d: %{roomId: room_id, userId: user_id}
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
    case Rooms.get_room_status(setter_id) do
      {_, nil} ->
        :noop

      {auth, _} when auth in [:creator, :mod] ->
        internal_set_listener(user_id, room_id)

      _ ->
        :noop
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
    case Rooms.get_room_status(setter_id) do
      {_, nil} ->
        :noop

      {:creator, _} ->
        internal_set_speaker(user_id, room_id)

      {_, _} ->
        :noop
    end
  end

  @spec internal_set_speaker(any, any) :: nil | :ok | {:err, {:error, :not_found}}
  defp internal_set_speaker(user_id, room_id) do
    case RoomPermissions.set_speaker(user_id, room_id, true) do
      {:ok, _} ->
        # kind of horrible to have to make a double genserver call
        # here, we'll have to think about how this works (who owns muting)
        Onion.RoomSession.add_speaker(
          room_id,
          user_id,
          Onion.UserSession.get(user_id, :muted)
        )

      err ->
        {:err, err}
    end
  catch
    _, _ ->
      {:error, "room not found"}
  end

  # only you can raise your own hand
  defp set_raised_hand(room_id, user_id, user_id) do
    # ??
    case RoomPermissions.ask_to_speak(user_id, room_id) do
      {:ok, %{isSpeaker: true}} ->
        Kousa.Room.internal_set_speaker(user_id, room_id)

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

  defp set_raised_hand(_, _, _), do: :noop

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
        Onion.RoomSession.start_supervised(
          room_id: room.id,
          voice_server_id: room.voiceServerId
        )

        muted? = Onion.UserSession.get(user_id, :muted)

        Onion.RoomSession.join_room(room.id, user_id, muted?, no_fan: true)

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
          private_check =
            if room.isPrivate do
              case Onion.RoomSession.redeem_invite(room.id, user_id) do
                :error ->
                  {:error, "the room is private, ask someone inside to invite you"}

                :ok ->
                  :ok
              end
            else
              :ok
            end

          case private_check do
            {:error, m} ->
              %{error: m}

            :ok ->
              if currentRoomId do
                leave_room(user_id, currentRoomId)
              end

              updated_user = Rooms.join_room(room, user_id)

              muted = Onion.UserSession.get(user_id, :muted)

              Onion.RoomSession.join_room(room_id, user_id, muted)

              canSpeak =
                case updated_user do
                  %{roomPermissions: %{isSpeaker: true}} -> true
                  _ -> false
                end

              join_vc_room(user_id, room, canSpeak || room.isPrivate)
              %{room: room}
          end
      end
    end
  catch
    _, _ -> {:error, "that room doesn't exist"}
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

      {:ok, %{roomId: current_room_id}}
    else
      {:error, "you are not in a room"}
    end
  end
end

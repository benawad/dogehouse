defmodule Broth.LegacyHandler do
  import Kousa.Utils.Version, only: [sigil_v: 2]
  import Broth.SocketHandler, only: [prepare_socket_msg: 2]
  require Logger

  Kousa.MixProject.project()
  |> Keyword.get(:version)
  |> Version.parse!()
  |> Version.compare(~v(0.2.0))
  |> case do
    :lt -> :ok
    _ -> raise CompileError, message: "this module should not exist beyond version 0.2.0"
  end

  def process(%{"op" => "block_user_and_from_room", "d" => payload}, state) do
    block_user_and_from_room(payload, state)
  end

  def process(%{"op" => "fetch_follow_list", "d" => payload}, state) do
    fetch_follow_list(payload, state)
  end

  def process(%{"op" => "join_room_and_get_info", "d" => payload, "fetchId" => fetch_id}, state) do
    join_room_and_get_info(payload, fetch_id, state)
  end

  def process(%{"op" => "audio_autoplay_error"}, state) do
    audio_autoplay_error(state)
  end

  # legacy implementation special cases
  defp block_user_and_from_room(%{"userId" => user_id_to_block}, state) do
    Logger.error(
      "block_user_and_from_room command is deprecated.  Send two user:block and room:ban operations instead"
    )

    Kousa.UserBlock.block(state.user_id, user_id_to_block)
    Kousa.Room.block_from_room(state.user_id, user_id_to_block)
    {:ok, state}
  end

  defp fetch_follow_list(
         %{"userId" => user_id, "isFollowing" => get_following_list, "cursor" => cursor},
         state
       ) do
    {users, nextCursor} =
      Kousa.Follow.get_follow_list(state.user_id, user_id, get_following_list, cursor)

    {:reply,
     prepare_socket_msg(
       %{
         op: "fetch_follow_list_done",
         d: %{
           isFollowing: get_following_list,
           userId: user_id,
           users: users,
           nextCursor: nextCursor,
           initial: cursor == 0
         }
       },
       state
     ), state}
  end

  defp join_room_and_get_info(%{"roomId" => room_id_to_join}, fetch_id, state) do
    reply =
      case Kousa.Room.join_room(state.user_id, room_id_to_join) do
        %{error: err} ->
          %{error: err}

        %{room: room} ->
          {room_id, users} = Beef.Users.get_users_in_current_room(state.user_id)

          case Onion.RoomSession.lookup(room_id) do
            [] ->
              %{error: "Room no longer exists."}

            _ ->
              {muteMap, autoSpeaker, activeSpeakerMap} =
                if room_id do
                  Onion.RoomSession.get_maps(room_id)
                else
                  {%{}, false, %{}}
                end

              payload = %{
                room: room,
                users: users,
                muteMap: muteMap,
                activeSpeakerMap: activeSpeakerMap,
                roomId: room_id,
                autoSpeaker: autoSpeaker
              }

              %{d: payload, op: "fetch_done", fetchId: fetch_id}
          end

        _ ->
          %{error: "error"}
      end

    {:reply, prepare_socket_msg(reply, state), state}
  end

  defp audio_autoplay_error(state) do
    Onion.UserSession.send_ws(
      state.user_id,
      nil,
      %{
        op: "error",
        d: "browser can't autoplay audio the first time, go press play audio in your browser"
      }
    )

    {:ok, state}
  end
end

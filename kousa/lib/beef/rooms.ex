defmodule Beef.Rooms do
  @moduledoc """
  Empty context module for Rooms
  """

  # ACCESS functions
  defdelegate get_room_status(user_id), to: Beef.Access.Rooms
  defdelegate can_join_room(room_id, user_id), to: Beef.Access.Rooms
  defdelegate get_top_public_rooms(user_id, offset \\ 0), to: Beef.Access.Rooms
  defdelegate get_room_by_id(room_id), to: Beef.Access.Rooms
  defdelegate get_next_creator_for_room(room_id), to: Beef.Access.Rooms
  defdelegate get_a_user_for_room(room_id), to: Beef.Access.Rooms
  defdelegate get_room_by_creator_id(creator_id), to: Beef.Access.Rooms
  defdelegate owner?(room_id, user_id), to: Beef.Access.Rooms
  defdelegate search_name(start_of_name), to: Beef.Access.Rooms
  @spec all_rooms :: any
  defdelegate all_rooms(), to: Beef.Access.Rooms

  # MUTATION functions
  defdelegate set_room_privacy_by_creator_id(user_id, isPrivate, new_name),
    to: Beef.Mutations.Rooms

  defdelegate replace_room_owner(user_id, new_creator_id), to: Beef.Mutations.Rooms
  defdelegate join_room(room, user_id), to: Beef.Mutations.Rooms
  defdelegate increment_room_people_count(room_id), to: Beef.Mutations.Rooms
  defdelegate increment_room_people_count(room_id, new_people_list), to: Beef.Mutations.Rooms
  defdelegate delete_room_by_id(room_id), to: Beef.Mutations.Rooms
  defdelegate decrement_room_people_count(room_id, new_people_list), to: Beef.Mutations.Rooms
  defdelegate set_room_owner_and_dec(room_id, user_id, new_people_list), to: Beef.Mutations.Rooms
  defdelegate kick_from_room(user_id, room_id), to: Beef.Mutations.Rooms
  defdelegate leave_room(user_id, room_id), to: Beef.Mutations.Rooms
  defdelegate raw_insert(data, peoplePreviewList), to: Beef.Mutations.Rooms
  defdelegate update_name(user_id, name), to: Beef.Mutations.Rooms
  defdelegate create(data), to: Beef.Mutations.Rooms
  defdelegate edit(room_id, data), to: Beef.Mutations.Rooms
end

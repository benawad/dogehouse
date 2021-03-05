defmodule Beef.Users do
  @moduledoc """
  Context module for Users.  This module acts as a "gateway" module defining
  the "boundary" for Users database access.  Consider Beef.Users.* modules
  to be "private modules".  If in the future we would like to enforce these
  boundary conditions at compile time, consider using Sasa Juric's Boundary
  library:

  https://hex.pm/packages/boundary

  NB (5 Mar 2021): these functions are probably going to get streamlined =D
  """

  # ACCESS functions
  defdelegate find_by_github_ids(ids), to: Beef.Userss
  defdelegate get_by_id(user_id), to: Beef.Userss
  defdelegate get_by_username(username), to: Beef.Userss

  defdelegate search(query, offset), to: Beef.Userss
  defdelegate get_users_in_current_room(user_id), to: Beef.Userss
  defdelegate tuple_get_current_room_id(user_id), to: Beef.Userss
  defdelegate get_by_id_with_current_room(user_id), to: Beef.Userss
  defdelegate get_current_room(user_id), to: Beef.Userss
  defdelegate get_current_room_id(user_id), to: Beef.Userss

  # MUTATIONS
  defdelegate edit_profile(user_id, data), to: Beef.Userss
  defdelegate delete(user_id), to: Beef.Userss
  defdelegate bulk_insert(users), to: Beef.Userss
  defdelegate inc_num_following(user_id, n), to: Beef.Userss
  defdelegate set_reason_for_ban(user_id, reason_for_ban), to: Beef.Userss
  defdelegate set_online(user_id), to: Beef.Userss
  defdelegate set_user_left_current_room(user_id), to: Beef.Userss
  defdelegate set_offline(user_id), to: Beef.Userss

  defdelegate set_current_room(user_id, room_id), to: Beef.Userss

  # TODO: make can_speak, returning, a single keyword list
  defdelegate set_current_room(user_id, room_id, can_speak), to: Beef.Userss
  defdelegate set_current_room(user_id, room_id, can_speak, returning), to: Beef.Userss
  defdelegate twitter_find_or_create(user), to: Beef.Userss
  defdelegate github_find_or_create(user, github_access_token), to: Beef.Userss
end

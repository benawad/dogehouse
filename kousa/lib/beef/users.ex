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
  defdelegate find_by_github_ids(ids), to: Beef.Access.Users
  defdelegate get_by_id(user_id), to: Beef.Access.Users
  defdelegate get_by_username(username), to: Beef.Access.Users

  defdelegate search(query, offset), to: Beef.Access.Users
  defdelegate get_users_in_current_room(user_id), to: Beef.Access.Users
  defdelegate tuple_get_current_room_id(user_id), to: Beef.Access.Users
  defdelegate get_by_id_with_current_room(user_id), to: Beef.Access.Users
  defdelegate get_current_room(user_id), to: Beef.Access.Users
  defdelegate get_current_room_id(user_id), to: Beef.Access.Users

  # MUTATIONS
  defdelegate edit_profile(user_id, data), to: Beef.Mutations.Users
  defdelegate delete(user_id), to: Beef.Mutations.Users
  defdelegate bulk_insert(users), to: Beef.Mutations.Users
  defdelegate inc_num_following(user_id, n), to: Beef.Mutations.Users
  defdelegate set_reason_for_ban(user_id, reason_for_ban), to: Beef.Mutations.Users
  defdelegate set_online(user_id), to: Beef.Mutations.Users
  defdelegate set_user_left_current_room(user_id), to: Beef.Mutations.Users
  defdelegate set_offline(user_id), to: Beef.Mutations.Users

  defdelegate set_current_room(user_id, room_id), to: Beef.Mutations.Users

  # TODO: make can_speak, returning, a single keyword list
  defdelegate set_current_room(user_id, room_id, can_speak), to: Beef.Mutations.Users
  defdelegate set_current_room(user_id, room_id, can_speak, returning), to: Beef.Mutations.Users
  defdelegate twitter_find_or_create(user), to: Beef.Mutations.Users
  defdelegate github_find_or_create(user, github_access_token), to: Beef.Mutations.Users
end

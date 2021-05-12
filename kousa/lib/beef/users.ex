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
  defdelegate get(user_id), to: Beef.Access.Users
  # not implemented yet:
  defdelegate get(user_id, opts), to: Beef.Access.Users

  defdelegate find_by_github_ids(ids), to: Beef.Access.Users
  defdelegate search(query, offset), to: Beef.Access.Users

  #####################################################################################
  # CHOPPING BLOCK
  # we should strive to make the queries simpler and *reduce code*, so
  # these functions are on the chopping block.  Strategy should be to query the get
  # function and retrieve the data either from the fields or with a preload.
  defdelegate get_by_id(user_id), to: Beef.Access.Users
  defdelegate get_by_id_with_follow_info(me_id, them_id), to: Beef.Access.Users
  defdelegate get_by_id_with_room_permissions(user_id), to: Beef.Access.Users
  defdelegate get_by_username(username), to: Beef.Access.Users
  defdelegate get_by_username_with_follow_info(user_id, username), to: Beef.Access.Users
  defdelegate search_username(username), to: Beef.Access.Users

  defdelegate get_users_in_current_room(user_id), to: Beef.Access.Users
  defdelegate tuple_get_current_room_id(user_id), to: Beef.Access.Users
  defdelegate get_by_id_with_current_room(user_id), to: Beef.Access.Users
  defdelegate get_current_room(user_id), to: Beef.Access.Users
  defdelegate get_current_room_id(user_id), to: Beef.Access.Users
  defdelegate get_ip(user_id), to: Beef.Access.Users
  defdelegate bot?(user_id), to: Beef.Access.Users
  defdelegate get_by_api_key(api_key), to: Beef.Access.Users
  defdelegate count_bot_accounts(user_id), to: Beef.Access.Users
  # CHOPPING BLOCK
  ######################################################################################

  # MUTATIONS
  defdelegate update(changeset), to: Beef.Repo

  defdelegate edit_profile(user_id, data), to: Beef.Mutations.Users
  defdelegate delete(user_id), to: Beef.Mutations.Users
  defdelegate bulk_insert(users), to: Beef.Mutations.Users
  defdelegate inc_num_following(user_id, n), to: Beef.Mutations.Users
  defdelegate set_reason_for_ban(user_id, reason_for_ban), to: Beef.Mutations.Users
  defdelegate set_online(user_id), to: Beef.Mutations.Users
  defdelegate set_user_left_current_room(user_id), to: Beef.Mutations.Users
  defdelegate set_offline(user_id), to: Beef.Mutations.Users

  defdelegate set_current_room(user_id, room_id), to: Beef.Mutations.Users
  defdelegate create_bot(user_id, username), to: Beef.Mutations.Users

  # TODO: make can_speak, returning, a single keyword list
  defdelegate set_current_room(user_id, room_id, can_speak), to: Beef.Mutations.Users
  defdelegate set_current_room(user_id, room_id, can_speak, returning), to: Beef.Mutations.Users
  defdelegate twitter_find_or_create(user), to: Beef.Mutations.Users
  defdelegate set_ip(user_id, ip), to: Beef.Mutations.Users
  defdelegate github_find_or_create(user, github_access_token), to: Beef.Mutations.Users
  defdelegate discord_find_or_create(user, discord_access_token), to: Beef.Mutations.Users
end

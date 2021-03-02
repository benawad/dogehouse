defmodule Kousa.Data.User do
  defdelegate edit_profile(u, d), to: Beef.Users
  defdelegate search(q, o), to: Beef.Users
  defdelegate bulk_insert(u), to: Beef.Users
  defdelegate find_by_github_ids(i), to: Beef.Users
  defdelegate inc_num_following(u, n), to: Beef.Users
  defdelegate get_users_in_current_room(u), to: Beef.Users
  defdelegate get_by_id(u), to: Beef.Users
  defdelegate get_by_username(u), to: Beef.Users
  defdelegate set_reason_for_ban(u, r), to: Beef.Users
  defdelegate get_by_id_with_current_room(u), to: Beef.Users
  defdelegate set_online(u), to: Beef.Users
  defdelegate set_user_left_current_room(u), to: Beef.Users
  defdelegate set_offline(u), to: Beef.Users
  defdelegate get_current_room(u), to: Beef.Users
  defdelegate tuple_get_current_room_id(user_id), to: Beef.Users
  defdelegate get_current_room_id(user_id), to: Beef.Users
  defdelegate set_current_room(u, r), to: Beef.Users
  defdelegate set_current_room(u, r, c), to: Beef.Users
  defdelegate set_current_room(u, r, c, r), to: Beef.Users
  defdelegate twitter_find_or_create(u), to: Beef.Users
  defdelegate github_find_or_create(u, gat), to: Beef.Users
end

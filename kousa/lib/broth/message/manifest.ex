defmodule Broth.Message.Manifest do
  alias Broth.Message.Auth
  alias Broth.Message.Chat
  alias Broth.Message.Room
  alias Broth.Message.User
  alias Broth.Message.Misc

  @actions %{
    "test:operator" => BrothTest.MessageTest.TestOperator,
    "user:create_bot" => User.CreateBot,
    "user:ban" => User.Ban,
    "user:block" => User.Block,
    "user:unblock" => User.Unblock,
    "user:follow" => User.Follow,
    "user:get_following" => User.GetFollowing,
    "user:get_followers" => User.GetFollowers,
    "user:update" => User.Update,
    "user:get_info" => User.GetInfo,
    "user:get_bots" => User.GetBots,
    "user:revoke_api_key" => User.RevokeApiKey,
    "user:get_relationship" => User.GetRelationship,
    "user:unfollow" => User.Unfollow,
    "user:admin_update" => User.AdminUpdate,
    "room:invite" => Room.Invite,
    "room:update" => Room.Update,
    "room:get_invite_list" => Room.GetInviteList,
    "room:leave" => Room.Leave,
    "room:ban" => Room.Ban,
    "room:set_role" => Room.SetRole,
    "room:set_auth" => Room.SetAuth,
    "room:join" => Room.Join,
    "room:get_banned_users" => Room.GetBannedUsers,
    "room:update_scheduled" => Room.UpdateScheduled,
    "room:delete_scheduled" => Room.DeleteScheduled,
    "room:create" => Room.Create,
    "room:create_scheduled" => Room.CreateScheduled,
    "room:unban" => Room.Unban,
    "room:get_info" => Room.GetInfo,
    "room:get_top" => Room.GetTop,
    "room:set_active_speaker" => Room.SetActiveSpeaker,
    "room:mute" => Room.Mute,
    "room:deafen" => Room.Deafen,
    "room:get_scheduled" => Room.GetScheduled,
    "chat:ban" => Chat.Ban,
    "chat:unban" => Chat.Unban,
    "chat:send_msg" => Chat.Send,
    "chat:delete" => Chat.Delete,
    "auth:request" => Auth.Request,
    "misc:search" => Misc.Search
  }

  # verify that all of the actions are accounted for in the
  # operators list
  alias Broth.Message.Types.Operator
  require Operator

  @actions
  |> Map.values()
  |> Enum.each(fn module ->
    Operator.valid_value?(module) ||
      raise CompileError,
        description: "the module #{inspect(module)} is not a member of #{inspect(Operator)}"
  end)

  def actions, do: @actions
end

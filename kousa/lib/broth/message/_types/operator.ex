import EctoEnum

alias Broth.Message.User
alias Broth.Message.Room
alias Broth.Message.Chat
alias Broth.Message.Auth
alias Broth.Message.Misc

defenum(
  Broth.Message.Types.Operator,
  [
    # user commands and casts: 0..63
    {User.GetFollowing, 1},
    {User.GetFollowers, 2},
    {User.Follow, 3},
    {User.Ban, 4},
    {User.Update, 5},
    {User.GetInfo, 6},
    {User.GetRelationship, 7},
    {User.Block, 10},
    {User.Unfollow, 11},
    {User.CreateBot, 12},
    {User.Unblock, 13},
    {User.GetBots, 14},
    {User.RevokeApiKey, 15},
    {User.AdminUpdate, 16},
    # room commands and casts: 64..127
    {Room.Invite, 65},
    {Room.Update, 66},
    {Room.GetInviteList, 67},
    {Room.Leave, 68},
    {Room.Ban, 69},
    {Room.SetRole, 70},
    {Room.SetAuth, 71},
    {Room.Join, 72},
    {Room.UpdateScheduled, 74},
    {Room.DeleteScheduled, 75},
    {Room.Create, 76},
    {Room.CreateScheduled, 77},
    {Room.Unban, 78},
    {Room.GetScheduled, 79},
    {Room.GetInfo, 80},
    {Room.GetTop, 81},
    {Room.SetActiveSpeaker, 82},
    {Room.Mute, 83},
    {Room.GetBannedUsers, 84},
    {Room.Deafen, 85},
    # chat commands and casts: 128..191
    {Chat.Ban, 129},
    {Chat.Send, 130},
    {Chat.Delete, 131},
    {Chat.Unban, 132},
    # auth and maintenance commands 192..254
    {Auth.Request, 193},
    {Misc.Search, 210},
    # etc 255 - 317
    {BrothTest.MessageTest.TestOperator, 255}
  ]
)

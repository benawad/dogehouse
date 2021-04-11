import EctoEnum

alias Broth.Message.User
alias Broth.Message.Room
alias Broth.Message.Chat
alias Broth.Message.Auth

defenum(
  Broth.Message.Types.Operator,
  [
    # user commands and casts: 0..63
    {User.GetFollowing, 1},
    {User.GetFollows, 2},
    {User.Follow, 3},
    {User.Ban, 4},
    {User.Update, 5},
    {User.GetRoomsAboutToStart, 6},
    {User.GetScheduledRooms, 7},
    {User.GetInfo, 8},
    {User.GetRelationship, 9},
    {User.Block, 10},
    # room commands and casts: 64..127
    {Room.Invite, 65},
    {Room.Update, 66},
    {Room.GetInviteList, 67},
    {Room.UpdateSpeaking, 68},
    {Room.Leave, 69},
    {Room.Ban, 70},
    {Room.SetRole, 71},
    {Room.SetMod, 72},
    {Room.Join, 73},
    {Room.GetUsers, 74},
    {Room.UpdateScheduled, 75},
    {Room.DeleteScheduled, 76},
    {Room.Create, 77},
    {Room.CreateScheduled, 78},
    {Room.Unban, 79},
    {Room.GetInfo, 80},
    # chat commands and casts: 128..191
    {Chat.Ban, 129},
    {Chat.SendMsg, 130},
    {Chat.DeleteMsg, 131},
    # auth and maintenance commands 192..254
    {Auth.Request, 193},
    # etc 222 - 255
    {BrothTest.MessageTest.TestOperator, 255}
  ]
)

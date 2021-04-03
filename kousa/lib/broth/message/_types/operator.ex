import EctoEnum

alias Broth.Message.User
alias Broth.Message.Room
alias Broth.Message.Chat

defenum(
  Broth.Message.Types.Operator,
  [
    {BrothTest.MessageTest.TestOperator, 255},
    # user commands and casts: 0..63
    {User.GetFollowing, 1},
    {User.GetFollows, 2},
    {User.Follow, 3},
    {User.Ban, 4},
    {User.Update, 5},
    # room commands and casts: 64..127
    {Room.Invite, 65},
    {Room.Update, 66},
    {Room.GetInviteList, 67},
    {Room.UpdateSpeaking, 68},
    {Room.Leave, 69},
    {Room.Block, 70},
    {Room.SetRole, 71},
    {Room.SetMod, 72},
    # chat commands and casts: 128..191
    {Chat.Block, 129},
    {Chat.SendMsg, 130},
    {Chat.DeleteMsg, 131}
  ]
)

import EctoEnum

defenum(
  Broth.Message.Types.Operator,
  [
    {BrothTest.MessageTest.TestOperator, 255},
    # user commands and casts: 0..63
    {Broth.Message.User.GetFollowing, 1},
    {Broth.Message.User.Ban, 2},
    # room commands and casts: 64..127
    {Broth.Message.Room.Invite, 65},
    {Broth.Message.Room.Update, 66},
    {Broth.Message.Room.GetInviteList, 67},
    {Broth.Message.Room.UpdateSpeaking, 68},
    {Broth.Message.Room.Leave, 69},
    {Broth.Message.Room.Block, 70},
    {Broth.Message.Room.SetRole, 71},
    {Broth.Message.Room.SetMod, 72}
  ]
)

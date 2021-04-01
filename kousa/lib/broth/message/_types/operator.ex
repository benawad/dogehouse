import EctoEnum

defenum(
  Broth.Message.Types.Operator,
  [
    {BrothTest.MessageTest.TestOperator, 255},
    # user commands and casts: 0..63
    {Broth.Message.User.GetFollowing, 1},
    # room commands and casts: 64..127
    {Broth.Message.Room.Invite, 65},
    {Broth.Message.Room.Update, 66}
  ]
)

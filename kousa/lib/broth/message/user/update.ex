defmodule Broth.Message.User.Update do
  use Broth.Message, call: __MODULE__

  @derive {Jason.Encoder, only: ~w(
    muted
    error
    isUsernameTaken
  )a}

  @primary_key false
  schema "users" do
    field :muted, :boolean
    field :username, :string

    embed_error()

    # TODO: Deprecate this field
    field :isUsernameTaken, :boolean
  end

end

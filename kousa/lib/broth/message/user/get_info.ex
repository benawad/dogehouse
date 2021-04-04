defmodule Broth.Message.User.GetInfo do
  use Ecto.Schema

  @primary_key false
  embedded_schema do
  end

  import Ecto.Changeset

  def changeset(changeset, _), do: change(changeset)

  defmodule Reply do
    use Ecto.Schema

    @primary_key false
    embedded_schema do
      embeds_one(:user, Beef.Schemas.User)
    end
  end
end

defmodule Kousa.Github do
  def pick_primary_email([]) do
    nil
  end

  def pick_primary_email(emails) do
    primary_email = Enum.find(emails, &(&1["primary"] == true))

    if(is_nil(primary_email),
      do: Enum.at(emails, 0)["email"],
      else: primary_email["email"]
    )
  end
end

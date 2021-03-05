defmodule Beef.Notifications do
  import Ecto.Query
  alias Beef.Schemas.Notification

  def insert(data) do
    %Notification{}
    |> Notification.insert_changeset(data)
    |> Beef.Repo.insert(on_conflict: :nothing)
  end
end

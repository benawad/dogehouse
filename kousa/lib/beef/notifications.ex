defmodule Beef.Notifications do
  alias Beef.Schemas.Notification

  def insert(data) do
    %Notification{}
    |> Notification.insert_changeset(data)
    |> Beef.Repo.insert(on_conflict: :nothing, returning: true, preload: :notifier)
  end
end

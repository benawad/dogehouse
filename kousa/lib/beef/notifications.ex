defmodule Beef.Notifications do
  alias Beef.Schemas.Notification
  import Ecto.Query

  def insert(data) do
    %Notification{}
    |> Notification.insert_changeset(data)
    |> Beef.Repo.insert(on_conflict: :nothing, returning: true, preload: :notifier)
  end

  def exists(type, user_id, notifier_id, is_read \\ false) do
    from(n in Notification,
      where: n.type == ^type and n.user_id == ^user_id and n.notifier_id == ^notifier_id and n.is_read == ^is_read
    )
    |> Beef.Repo.exists?
  end
end

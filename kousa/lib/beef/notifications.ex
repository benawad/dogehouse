defmodule Beef.Notifications do
  alias Beef.Schemas.Notification
  import Ecto.Query
  @fetch_limit 10

  def insert(data) do
    %Notification{}
    |> Notification.insert_changeset(data)
    |> Beef.Repo.insert(on_conflict: :nothing, returning: true)
  end

  def update(data) do
    %Notification{user_id: data.user_id, id: data.id}
    |> Notification.edit_changeset(data)
    |> Beef.Repo.update
  end

  def unread_exists?(type, user_id, notifier_id, is_read \\ false) do
    from(n in Notification,
      where: n.type == ^type and n.user_id == ^user_id and n.notifier_id == ^notifier_id and n.is_read == ^is_read
    )
    |> Beef.Repo.exists?
  end

  def get_feed(user_id, cursor) do

      from(n in Notification,
        inner_join: u in assoc(n, :notifier),
        on: n.notifier_id == u.id,
        where: n.user_id == ^user_id,
        order_by: [desc: n.inserted_at],
        offset: ^cursor,
        limit: ^@fetch_limit,
        preload: [
          notifier: u
        ]
      )
      |> Beef.Repo.all
      |> Beef.Repo.preload(:notifier)
      |> Enum.map(fn n -> %{n | notifier: Map.merge(n.notifier, Beef.Follows.get_info(n.user_id, n.notifier_id))} end)
  end
end

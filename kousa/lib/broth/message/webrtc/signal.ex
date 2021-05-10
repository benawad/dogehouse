defmodule Broth.Message.WebRTC.Signal do
  use Broth.Message.Cast

  @primary_key false
  embedded_schema do
    field(:data, :map)
  end

  def changeset(initializer \\ %__MODULE__{}, data) do
    initializer
    |> cast(data, [:data])
  end

  alias Broth.SocketHandler
  alias Beef.Schemas.User
  alias Beef.Users

  def execute(changeset, %SocketHandler{user: %User{id: user_id}} = state) do
    with {:ok, %{data: data}} <- apply_action(changeset, :validate) do
      case data do
        %{"sdp" => sdp} ->
          Onion.AudioPipeline.signal(
            Users.get_current_room_id(user_id),
            user_id,
            {:sdp_answer, sdp}
          )

        %{"candidate" => candidate} ->
          Onion.AudioPipeline.signal(
            Users.get_current_room_id(user_id),
            user_id,
            {:candidate, candidate}
          )
      end
    end

    {:noreply, state}
  end
end

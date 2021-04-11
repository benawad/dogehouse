defmodule Broth.Message do
  use Ecto.Schema

  alias Ecto.Changeset
  import Changeset

  @primary_key false
  embedded_schema do
    field(:operator, Broth.Message.Types.Operator, null: false)
    field(:payload, :map)
    field(:reference, :binary_id)
  end

  def changeset(source, data) do
    source
    |> change()
    |> Map.put(:params, data)
    |> find(:operator)
    |> find(:payload)
    |> find(:reference, :optional)
    |> cast_operator
    |> internal_cast([:operator, :reference])
    |> validate_required([:operator])
    |> cast_payload
    |> validate_calls_have_references
  end

  @type message_field :: :operator | :payload | :reference

  # TODO: slowly deprecate "d" and "id" forms in the following table.
  @valid_forms %{
    operator: ~w(operator op),
    payload: ~w(payload p d),
    reference: ~w(reference ref fetchId)
  }

  @operators %{
    "test:operator" => BrothTest.MessageTest.TestOperator,
    "user:ban" => Broth.Message.User.Ban,
    "user:block" => Broth.Message.User.Block,
    "user:follow" => Broth.Message.User.Follow,
    "user:get_following" => Broth.Message.User.GetFollowing,
    "user:get_follows" => Broth.Message.User.GetFollows,
    "user:update" => Broth.Message.User.Update,
    "user:get_rooms_about_to_start" => Broth.Message.User.GetRoomsAboutToStart,
    "user:get_scheduled_rooms" => Broth.Message.User.GetScheduledRooms,
    "user:get_info" => Broth.Message.User.GetInfo,
    "user:get_relationship" => Broth.Message.User.GetRelationship,
    "room:invite" => Broth.Message.Room.Invite,
    "room:update" => Broth.Message.Room.Update,
    "room:get_invite_list" => Broth.Message.Room.GetInviteList,
    "room:update_speaking" => Broth.Message.Room.UpdateSpeaking,
    "room:leave" => Broth.Message.Room.Leave,
    "room:ban" => Broth.Message.Room.Ban,
    "room:set_role" => Broth.Message.Room.SetRole,
    "room:set_auth" => Broth.Message.Room.SetAuth,
    "room:join" => Broth.Message.Room.Join,
    "room:get_users" => Broth.Message.Room.GetUsers,
    "room:update_scheduled" => Broth.Message.Room.UpdateScheduled,
    "room:delete_scheduled" => Broth.Message.Room.DeleteScheduled,
    "room:create" => Broth.Message.Room.Create,
    "room:create_scheduled" => Broth.Message.Room.CreateScheduled,
    "room:unban" => Broth.Message.Room.Unban,
    "room:get_info" => Broth.Message.Room.GetInfo,
    "room:change_owner" => Broth.Message.Room.ChangeOwner,
    "chat:ban" => Broth.Message.Chat.Ban,
    "chat:send_msg" => Broth.Message.Chat.SendMsg,
    "chat:delete_msg" => Broth.Message.Chat.DeleteMsg,
    "auth:request" => Broth.Message.Auth.Request
  }

  defp find(changeset, field, optional \\ false) when is_atom(field) do
    find(changeset, field, @valid_forms[field], optional)
  end

  @spec find(Changeset.t(), message_field, [String.t()], :optional | false) :: Changeset.t()

  defp find(changeset = %{params: params}, field, [form | _], _)
       when is_map_key(params, form) do
    %{changeset | params: Map.put(changeset.params, "#{field}", params[form])}
  end

  defp find(changeset, field, [_ | rest], optional), do: find(changeset, field, rest, optional)

  defp find(changeset, field, [], optional) do
    if optional do
      changeset
    else
      add_error(changeset, field, "no #{field} present")
    end
  end

  defp cast_operator(changeset = %{valid?: false}), do: changeset

  defp cast_operator(changeset = %{params: params = %{"operator" => op}}) do
    if operator = @operators[op] do
      %{changeset | params: Map.put(params, "operator", operator)}
    else
      changeset
    end
  end

  defp cast_payload(changeset = %{valid?: false}), do: changeset

  defp cast_payload(changeset) do
    operator = get_field(changeset, :operator)

    operator
    |> struct
    |> operator.changeset(changeset.params["payload"])
    |> apply_action(:validate)
    |> case do
      {:ok, contract} ->
        put_change(changeset, :payload, contract)

      {:error, inner_changeset} ->
        %{changeset | errors: inner_changeset.errors, valid?: false}
    end
  end

  defp internal_cast(changeset, fields), do: cast(changeset, changeset.params, fields)

  def validate(data) do
    %__MODULE__{}
    |> changeset(data)
    |> apply_action(:validate)
  end

  defp validate_calls_have_references(changeset = %{valid?: false}), do: changeset

  defp validate_calls_have_references(changeset) do
    operator = get_field(changeset, :operator)

    # if the operator has a reply submodule then it must be a "call" message.
    # verify that these
    operator
    |> Module.concat(Reply)
    |> function_exported?(:__info__, 1)
    |> if do
      validate_required(changeset, [:reference], message: "is required for #{inspect(operator)}")
    else
      changeset
    end
  end
end

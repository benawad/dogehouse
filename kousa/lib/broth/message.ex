defmodule Broth.Message do
  use Ecto.Schema

  alias Ecto.Changeset
  import Changeset
  import Kousa.Utils.Version, only: [sigil_v: 2]

  @primary_key false
  embedded_schema do
    field(:operator, Broth.Message.Types.Operator, null: false)
    field(:payload, :map)
    field(:reference, :binary_id)
    field(:original_operator, :string)
    field(:version, Kousa.Utils.Version, default: ~v(0.1.0))
    # reply messages only
    field(:errors, :map)
  end

  @type t :: %__MODULE__{
    operator: module(),
    payload: map(),
    reference: Kousa.Utils.UUID.t,
    original_operator: String.t
  }

  def changeset(source \\ %__MODULE__{}, data) do
    source
    |> cast(data, [:version])
    |> Map.put(:params, data)
    |> find(:operator)
    |> find(:payload)
    |> find(:reference, :optional)
    |> cast_operator
    |> internal_cast([:operator, :reference])
    |> validate_required([:operator])
    |> cast_payload()
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
    |> put_change(:original_operator, op)
  end

  defp cast_payload(changeset = %{valid?: false}, _state), do: changeset
  defp cast_payload(changeset) do
    operator = get_field(changeset, :operator)
    changeset.params["payload"]
    |> operator.changeset()
    |> case do
      inner_changeset = %{valid?: true} ->
        put_change(changeset, :payload, inner_changeset)

      inner_changeset = %{valid?: false} ->
        %{changeset | errors: inner_changeset.errors, valid?: false}
    end
  end

  defp internal_cast(changeset, fields),  do: cast(changeset, changeset.params, fields)

  defp validate_calls_have_references(changeset = %{valid?: false}), do: changeset

  defp validate_calls_have_references(changeset) do
    operator = get_field(changeset, :operator)

    # if the operator has a reply submodule then it must be a "call" message.
    # verify that these
    if operator.reply_module() do
      validate_required(changeset, [:reference], message: "is required for #{inspect(operator)}")
    else
      changeset
    end
  end

  # encoding will only happen on egress out to the websocket.
  defimpl Jason.Encoder do
    def encode(value, opts) do
      %{
        op: value.operator.tag(),
        p: value.payload,
      }
      |> add_reference(value)
      |> add_errors(value)
      |> Broth.Translator.convert_outbound(value)
      |> Jason.Encode.map(opts)
    end

    defp add_reference(map, %{reference: nil}), do: map
    defp add_reference(map, %{reference: ref}), do: Map.put(map, :ref, ref)

    defp add_errors(map, %{errors: nil}), do: map
    defp add_errors(map, %{errors: e}), do: Map.put(map, :e, e)
  end
  
end

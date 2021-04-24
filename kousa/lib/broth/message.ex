defmodule Broth.Message do
  use Ecto.Schema

  alias Ecto.Changeset
  import Changeset

  @primary_key false
  embedded_schema do
    field(:operator, Broth.Message.Types.Operator, null: false)
    field(:payload, :map)
    field(:reference, :binary_id)
    field(:inbound_operator, :string)
    field(:version, Kousa.Utils.Version)
    # reply messages only
    field(:errors, :map)
  end

  @type t :: %__MODULE__{
          operator: module(),
          payload: map(),
          reference: Kousa.Utils.UUID.t(),
          inbound_operator: String.t()
        }

  @spec changeset(%{String.t() => Broth.json()}, Broth.SocketHandler.state()) :: Changeset.t()
  @doc """
  Primary validation function for all websocket messages.
  """
  def changeset(data, state) do
    %__MODULE__{}
    |> cast(data, [:inbound_operator])
    |> Map.put(:params, data)
    |> find(:operator)
    |> find(:payload)
    |> find(:reference, :optional)
    |> cast_operator
    |> cast_reference
    |> cast_inbound_operator
    |> cast_payload(state)
    |> validate_calls_have_references
    |> find(:version)
    |> cast_version
  end

  @type message_field :: :operator | :payload | :reference

  #########################################################################
  # TODO: deprecate other forms, convert into them in "Translator".
  # then collapse find into some simpler methods.

  @valid_forms %{
    operator: ~w(operator op),
    payload: ~w(payload p d),
    reference: ~w(reference ref fetchId),
    version: ~w(version v)
  }

  defp find(changeset, field, optional \\ false)
  defp find(changeset = %{valid?: false}, _, _), do: changeset

  defp find(changeset, field, optional) when is_atom(field) do
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

  ############################################################################

  @operators Broth.Message.Manifest.actions()

  defp cast_operator(changeset = %{valid?: false}), do: changeset

  defp cast_operator(changeset = %{params: %{"operator" => op}}) do
    if operator = @operators[op] do
      changeset
      |> put_change(:operator, operator)
      |> put_change(:inbound_operator, op)
    else
      add_error(changeset, :operator, "#{op} is invalid")
    end
  end

  defp cast_reference(changeset = %{valid?: false}), do: changeset

  defp cast_reference(changeset = %{params: %{"reference" => reference}}) do
    put_change(changeset, :reference, reference)
  end

  defp cast_reference(changeset), do: changeset

  defp cast_inbound_operator(changeset) do
    if get_field(changeset, :inbound_operator) do
      changeset
    else
      inbound_operator = get_field(changeset, :operator)
      put_change(changeset, :inbound_operator, inbound_operator)
    end
  end

  defp cast_payload(changeset = %{valid?: false}, _), do: changeset

  defp cast_payload(changeset, state) do
    operator = get_field(changeset, :operator)

    state
    |> operator.initialize()
    |> operator.changeset(changeset.params["payload"])
    |> case do
      inner_changeset = %{valid?: true} ->
        put_change(changeset, :payload, inner_changeset)

      inner_changeset = %{valid?: false} ->
        errors = Kousa.Utils.Errors.changeset_errors(inner_changeset)
        put_change(changeset, :errors, errors)
    end
  end

  defp cast_version(changeset = %{valid?: false}), do: changeset

  defp cast_version(changeset = %{params: params}) do
    if Map.has_key?(params, "version") do
      cast(changeset, params, [:version])
    else
      add_error(changeset, :version, "is required")
    end
  end

  defp validate_calls_have_references(changeset = %{valid?: false}), do: changeset

  defp validate_calls_have_references(changeset) do
    operator = get_field(changeset, :operator)

    # if the operator has a reply submodule then it must be a "call" message.
    # verify that these
    if function_exported?(operator, :reply_module, 0) do
      validate_required(changeset, [:reference], message: "is required for #{inspect(operator)}")
    else
      changeset
    end
  end

  # encoding will only happen on egress out to the websocket.
  defimpl Jason.Encoder do
    def encode(message, opts) do
      %{
        op: operator(message),
        p: message.payload,
        v: message.version
      }
      |> add_reference(message)
      |> add_errors(message)
      |> Broth.Translator.translate_outbound(message)
      |> Jason.Encode.map(opts)
    end

    defp operator(%{operator: op}) when is_binary(op), do: op

    defp operator(%{operator: op}) when is_atom(op) do
      if function_exported?(op, :operator, 0) do
        op.operator()
      end
    end

    defp add_reference(map, %{reference: nil}), do: map
    defp add_reference(map, %{reference: ref}), do: Map.put(map, :ref, ref)

    defp add_errors(map, %{errors: nil}), do: map
    defp add_errors(map, %{errors: e}), do: Map.put(map, :e, e)
  end
end

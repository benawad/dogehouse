defmodule Kousa.Utils.Errors do
  @spec changeset_errors(Ecto.Changeset.t()) :: map
  def changeset_errors(%{errors: errors}) do
    Map.new(errors, fn {k, {message, _}} -> {k, message} end)
  end

  def changeset_to_first_err_message(%{errors: [{_, {message, values}}]}) do
    Enum.reduce(values, message, fn {k, v}, acc ->
      String.replace(acc, "%{#{k}}", to_string(v))
    end)
  end

  def changeset_to_first_err_message(changeset) do
    Jason.encode!(changeset)
  end

  def changeset_to_first_err_message_with_field_name(%{errors: [{field, {message, values}}]}) do
    error =
      Kousa.Utils.Errors.changeset_to_first_err_message(%{errors: [{field, {message, values}}]})

    to_string(field) <> " " <> error
  end
end

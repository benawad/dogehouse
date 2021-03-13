defmodule Kousa.Errors do
  def changeset_to_first_err_message(%{errors: [{_, {message, values}}]}) do
    Enum.reduce(values, message, fn {k, v}, acc ->
      String.replace(acc, "%{#{k}}", to_string(v))
    end)
  end

  def changeset_to_first_err_message(changeset) do
    Poison.encode!(changeset)
  end

  def changeset_to_first_err_message_with_field_name(%{errors: [{field, {message, values}}]}) do
    error = Kousa.Errors.changeset_to_first_err_message(%{errors: [{field, {message, values}}]})
    to_string(field) <> " " <> error
  end
end

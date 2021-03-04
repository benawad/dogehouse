defmodule Kousa.Errors do
  def changeset_to_first_err_message(%{errors: [{field, {message, values}}]}) do
    error = Enum.reduce(values, message, fn {k, v}, acc ->
      String.replace(acc, "%{#{k}}", to_string(v))
    end)
    to_string(field) <> " " <> error
  end

  def changeset_to_first_err_message(changeset) do
    Poison.encode!(changeset)
  end
end

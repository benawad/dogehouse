defmodule Kousa.Errors do
  def changeset_to_first_err_message(%{errors: [{_, {message, values}}]}) do
    Enum.reduce(values, message, fn {k, v}, acc ->
      String.replace(acc, "%{#{k}}", to_string(v))
    end)
  end

  def changeset_to_first_err_message(changeset) do
    Poison.encode!(changeset)
  end
end

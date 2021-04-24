defmodule Kousa.Utils.Version do
  use Ecto.Type

  def type, do: :string

  def cast(v) when is_binary(v) do
    Version.parse(v)
  end

  def cast(v = %Version{}) do
    {:ok, v}
  end

  def cast(_), do: :error

  def dump(v = %Version{}) do
    {:ok, to_string(v)}
  end

  def dump(_), do: :error

  def load(v) when is_binary(v) do
    Version.parse(v)
  end

  defmacro sigil_v({:<<>>, _, [version]}, []) do
    version
    |> Version.parse!()
    |> Macro.escape()
  end
end

defimpl Jason.Encoder, for: Version do
  def encode(version, _opts) do
    inspect(to_string(version))
  end
end

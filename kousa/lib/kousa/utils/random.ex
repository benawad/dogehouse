defmodule Kousa.Utils.Random do
  def ascii_id() do
    min = String.to_integer("100000", 36)
    max = String.to_integer("ZZZZZZ", 36)

    max
    |> Kernel.-(min)
    |> :rand.uniform()
    |> Kernel.+(min)
    |> Integer.to_string(36)
  end

  def big_ascii_id() do
    ascii_id() <> ascii_id()
  end
end

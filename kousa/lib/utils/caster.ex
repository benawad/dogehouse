defmodule Kousa.Caster do
  def bool(b) do
    cond do
      b == true -> true
      true -> false
    end
  end
end

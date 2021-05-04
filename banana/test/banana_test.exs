defmodule BananaTest do
  use ExUnit.Case
  doctest Banana

  test "greets the world" do
    assert Banana.hello() == :world
  end
end

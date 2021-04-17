ExUnit.start()

Ecto.Adapters.SQL.Sandbox.mode(Beef.Repo, :manual)

defmodule KousaTest do
  def elixir_module?(module) do
    module
    |> Atom.to_string
    |> String.starts_with?("Elixir")
  end

  @classes ~w(User Room Chat Auth)
  def message_module?(module) do
    exploded = Module.split(module)
    match?(["Broth", "Message", class, _] when class in @classes, exploded)
  end

  def message_validation_module?(module) do
    exploded = Module.split(module)
    match?(["KousaTest", "Broth", "Messages", class, _] when class in @classes, exploded)
  end

  def message_test_module?(module) do
    exploded = Module.split(module)
    match?(["KousaTest", "Broth", class, _] when class in @classes, exploded)
  end

  def test_for(module) do
    ["Broth", "Message", class, type] = Module.split(module)
    Module.concat(["BrothTest", class, type <> "Test"])
  end

  def validation_for(module) do
    ["Broth", "Message", class, type] = Module.split(module)
    Module.concat(["BrothTest", "Message", class, type <> "Test"])
  end
end

ExUnit.after_suite(fn _ ->
  # check to make sure all of the modules have corresponding tests
  all_elixir_modules = :code.all_loaded()
  |> Enum.map(&elem(&1, 0))
  |> Enum.filter(&KousaTest.elixir_module?/1)

  message_modules =
    Enum.filter(all_elixir_modules, &KousaTest.message_module?/1)

  message_test_modules =
    Enum.filter(all_elixir_modules, &KousaTest.message_test_module?/1)

  message_validation_modules =
    Enum.filter(all_elixir_modules, &KousaTest.message_validation_module?/1)

  Enum.each(message_modules, fn module ->
    unless KousaTest.test_for(module) in message_test_modules do
      raise "#{inspect module} did not have test module"
    end
    unless KousaTest.validation_for(module)in message_validation_modules do
      raise "#{inspect module} did not have validation module"
    end
  end)
end)

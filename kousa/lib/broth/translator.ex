defmodule Broth.Translator do
  @translations %{
    "create_room" => "room:create"
  }

  @translation_keys Map.keys(@translations)

  def convert_legacy(command = %{"op" => operation}) when operation in @translation_keys do
    %{command | "op" => @translations[operation]}
  end

  # the "auth:request" form requires a reply, so needs to add a "ref" field value to make it valid.
  # this should be ignored by the FE.
  def convert_legacy(command = %{"op" => "auth"}) do
    Map.merge(command, %{"op" => "auth:request", "ref" => UUID.uuid4()})
  end

  def convert_legacy(command) do
    command
  end
end

defmodule Broth.Translator do
  @direct_translation %{
                        #  "auth" => "auth:request"
                      }

  @direct_translation_keys Map.keys(@direct_translation)

  def convert_legacy(command = %{"op" => operation}) when operation in @direct_translation_keys do
    %{command | "op" => @direct_translation[operation]}
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

defmodule Onion.PubSub do
  @moduledoc """
  an opinionated wrapper around Phoenix.PubSub.

  - Each message is tagged with the topic string, to help you sort
    messages coming down the pipe.

  - Messages are required to be structs of the type `Broth.Message`
  """

  alias Phoenix.PubSub

  def subscribe(topic) do
    PubSub.subscribe(__MODULE__, topic)
  end

  def broadcast(topic, message = %Broth.Message{}) do
    PubSub.broadcast(__MODULE__, topic, {topic, message})
  end

end

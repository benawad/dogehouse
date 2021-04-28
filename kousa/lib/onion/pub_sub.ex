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

  @valid_classes ~w(chat)

  def broadcast(
        topic = <<class::binary-size(4)>> <> _,
        message = %Broth.Message{}
      )
      when class in @valid_classes do
    # do other validation here in test and dev, in the future.

    PubSub.broadcast(__MODULE__, topic, {topic, message})
  end

  def unsubscribe(topic) do
    PubSub.unsubscribe(__MODULE__, topic)
  end
end

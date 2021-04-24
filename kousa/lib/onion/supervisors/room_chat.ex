defmodule Onion.Supervisors.Chat do
  use Supervisor

  def start_link(init_arg) do
    Supervisor.start_link(__MODULE__, init_arg)
  end

  @impl true
  def init(_init_arg) do
    children = [
      {Registry, keys: :unique, name: Onion.RoomChatRegistry},
      {DynamicSupervisor, name: Onion.RoomChatDynamicSupervisor, strategy: :one_for_one}
    ]

    Supervisor.init(children, strategy: :one_for_one)
  end
end

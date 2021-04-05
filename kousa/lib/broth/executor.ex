defprotocol Broth.Executor do
  @type t :: struct()
  @type reply :: struct()

  # TODO: fill out the correct 'term' value for the state
  @spec execute(t, state :: term) ::
          {:reply, reply, state :: term}
          | {:ok, state :: term}
          | {:error, String.t()}
          | {:close, integer, String.t()}

  def execute(message, state)
end

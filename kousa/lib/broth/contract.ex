defmodule Broth.Contract do
  use Ecto.Schema

  embedded_schema do
    field :operand, Broth.Contracts.Types.Operator, null: false
    field :payload, :map
  end

  def changeset(source, data) do

  end
end

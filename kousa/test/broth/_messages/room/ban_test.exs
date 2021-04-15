defmodule BrothTest.Message.Room.BanTest do
  use ExUnit.Case, async: true

  @moduletag :message

  alias Broth.Message.Room.Ban

  setup do
    {:ok, uuid: UUID.uuid4()}
  end

  describe "when you send a block message" do
    test "it populates id", %{uuid: uuid} do
      assert {:ok,
              %{
                payload: %Ban{id: ^uuid}
              }} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "room:ban",
                 "payload" => %{"userId" => uuid}
               })

      # short form also allowed
      assert {:ok,
              %{
                payload: %Ban{id: ^uuid}
              }} =
               BrothTest.Support.Message.validate(%{
                 "op" => "room:ban",
                 "p" => %{"userId" => uuid}
               })
    end

    test "omitting the id is not allowed" do
      assert {:error, %{errors: [id: {"can't be blank", _}]}} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "room:ban",
                 "payload" => %{}
               })
    end
  end
end

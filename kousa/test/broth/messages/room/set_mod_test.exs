defmodule BrothTest.Message.Room.SetMod do
  use ExUnit.Case, async: true

  alias Broth.Message.Room.SetMod

  setup do
    {:ok, uuid: UUID.uuid4()}
  end

  describe "when you send an set mod message" do
    test "it validates", %{uuid: uuid} do
      assert {:ok,
              %{
                payload: %SetMod{userId: ^uuid, isMod: true}
              }} =
               Broth.Message.validate(%{
                 "operator" => "room:set_mod",
                 "payload" => %{"userId" => uuid, "isMod" => true}
               })

      # short form also allowed
      assert {:ok,
              %{
                payload: %SetMod{userId: ^uuid, isMod: false}
              }} =
               Broth.Message.validate(%{
                 "op" => "room:set_mod",
                 "p" => %{"userId" => uuid, "isMod" => false}
               })
    end

    test "omitting the userId is not allowed" do
      assert {:error, %{errors: [userId: {"can't be blank", _}]}} =
               Broth.Message.validate(%{
                 "operator" => "room:set_mod",
                 "payload" => %{"isMod" => true}
               })
    end

    test "omitting isMod is not allowed", %{uuid: uuid} do
      assert {:error, %{errors: [isMod: {"can't be blank", _}]}} =
               Broth.Message.validate(%{
                 "operator" => "room:set_mod",
                 "payload" => %{"userId" => uuid}
               })
    end

    test "isMod must be a bool", %{uuid: uuid} do
      assert {:error, %{errors: [isMod: {"is invalid", _}]}} =
        Broth.Message.validate(%{
          "operator" => "room:set_mod",
          "payload" => %{"userId" => uuid, "isMod" => "yes"}
        })
    end
  end
end

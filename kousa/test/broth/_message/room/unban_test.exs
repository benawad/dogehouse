defmodule BrothTest.Message.Room.UnbanTest do
  use ExUnit.Case, async: true
  @moduletag :message

  alias Broth.Message.Room.Unban

  setup do
    {:ok, uuid: UUID.uuid4()}
  end

  describe "when you send a unban message" do
    test "it populates userId", %{uuid: uuid} do
      assert {:ok,
              %{
                payload: %Unban{userId: ^uuid}
              }} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "room:unban",
                 "payload" => %{"userId" => uuid},
                 "reference" => UUID.uuid4()
               })

      # short form also allowed
      assert {:ok,
              %{
                payload: %Unban{userId: ^uuid}
              }} =
               BrothTest.Support.Message.validate(%{
                 "op" => "room:unban",
                 "p" => %{"userId" => uuid},
                 "ref" => UUID.uuid4()
               })
    end

    test "omitting the reference is not allowed", %{uuid: uuid} do
      assert {:error, %{errors: [reference: {"is required for Broth.Message.Room.Unban", _}]}} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "room:unban",
                 "payload" => %{"userId" => uuid}
               })
    end

    test "omitting the userId is not allowed" do
      assert {:error, %{errors: %{userId: "can't be blank"}}} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "room:unban",
                 "payload" => %{},
                 "reference" => UUID.uuid4()
               })
    end

    test "userId must be a UUID" do
      assert {:error, %{errors: %{userId: "is invalid"}}} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "room:unban",
                 "payload" => %{"userId" => "aaa"},
                 "reference" => UUID.uuid4()
               })
    end
  end
end

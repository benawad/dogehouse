defmodule BrothTest.Message.Room.UnbanIpTest do
  use ExUnit.Case, async: true
  @moduletag :message

  alias Broth.Message.Room.UnbanIp

  setup do
    {:ok, uuid: UUID.uuid4()}
  end

  describe "when you send a unban_ip message" do
    test "it populates userId", %{uuid: uuid} do
      assert {:ok,
              %{
                payload: %UnbanIp{userId: ^uuid}
              }} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "room:unban_ip",
                 "payload" => %{"userId" => uuid},
                 "reference" => UUID.uuid4()
               })

      # short form also allowed
      assert {:ok,
              %{
                payload: %UnbanIp{userId: ^uuid}
              }} =
               BrothTest.Support.Message.validate(%{
                 "op" => "room:unban_ip",
                 "p" => %{"userId" => uuid},
                 "ref" => UUID.uuid4()
               })
    end

    test "omitting the reference is not allowed", %{uuid: uuid} do
      assert {:error, %{errors: [reference: {"is required for Broth.Message.Room.UnbanIp", _}]}} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "room:unban_ip",
                 "payload" => %{"userId" => uuid}
               })
    end

    test "omitting the userId is not allowed" do
      assert {:error, %{errors: %{userId: "can't be blank"}}} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "room:unban_ip",
                 "payload" => %{},
                 "reference" => UUID.uuid4()
               })
    end

    test "userId must be a UUID" do
      assert {:error, %{errors: %{userId: "is invalid"}}} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "room:unban_ip",
                 "payload" => %{"userId" => "aaa"},
                 "reference" => UUID.uuid4()
               })
    end
  end
end

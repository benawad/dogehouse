defmodule BrothTest.Message.Room.BanIpTest do
  use ExUnit.Case, async: true

  @moduletag :message

  alias Broth.Message.Room.BanIp

  setup do
    {:ok, uuid: UUID.uuid4()}
  end

  describe "when you send a ban_ip message" do
    test "it populates userId", %{uuid: uuid} do
      assert {:ok,
              %{
                payload: %BanIp{userId: ^uuid}
              }} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "room:ban_ip",
                 "payload" => %{"userId" => uuid},
                 "reference" => UUID.uuid4()
               })

      # short form also allowed
      assert {:ok,
              %{
                payload: %BanIp{userId: ^uuid}
              }} =
               BrothTest.Support.Message.validate(%{
                 "op" => "room:ban_ip",
                 "p" => %{"userId" => uuid},
                 "ref" => UUID.uuid4()
               })
    end

    test "omitting the reference is not allowed", %{uuid: uuid} do
      assert {:error, %{errors: [reference: {"is required for Broth.Message.Room.BanIp", _}]}} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "room:ban_ip",
                 "payload" => %{"userId" => uuid}
               })
    end

    test "omitting the userId is not allowed" do
      assert {:error, %{errors: %{userId: "can't be blank"}}} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "room:ban_ip",
                 "payload" => %{},
                 "reference" => UUID.uuid4()
               })
    end

    test "userId must be a UUID" do
      assert {:error, %{errors: %{userId: "is invalid"}}} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "room:ban_ip",
                 "payload" => %{"userId" => "aaa"},
                 "reference" => UUID.uuid4()
               })
    end
  end
end

defmodule BrothTest.Message.User.BanTest do
  use ExUnit.Case, async: true

  @moduletag :message

  alias Broth.Message.User.Ban

  setup do
    {:ok, uuid: UUID.uuid4()}
  end

  describe "when you send an ban message" do
    test "it populates id", %{uuid: uuid} do
      assert {:ok,
              %{
                payload: %Ban{id: ^uuid, reason: "foobar"}
              }} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "user:ban",
                 "payload" => %{"id" => uuid, "reason" => "foobar"},
                 "reference" => UUID.uuid4()
               })

      # short form also allowed
      assert {:ok,
              %{
                payload: %Ban{id: ^uuid, reason: "foobar"}
              }} =
               BrothTest.Support.Message.validate(%{
                 "op" => "user:ban",
                 "p" => %{"id" => uuid, "reason" => "foobar"},
                 "ref" => UUID.uuid4()
               })
    end

    test "omitting the id is not allowed" do
      assert {:error, %{errors: [id: {"can't be blank", _}]}} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "user:ban",
                 "payload" => %{"reason" => "foobar"},
                 "reference" => UUID.uuid4()
               })
    end

    test "omitting the reason is not allowed", %{uuid: uuid} do
      assert {:error, %{errors: [reason: {"can't be blank", _}]}} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "user:ban",
                 "payload" => %{"id" => uuid},
                 "reference" => UUID.uuid4()
               })
    end

    test "omitting the reference is not allowed", %{uuid: uuid} do
      assert {:error, %{errors: [reference: {"is required for Broth.Message.User.Ban", _}]}} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "user:ban",
                 "payload" => %{"id" => uuid, "reason" => "foobar"}
               })
    end
  end
end

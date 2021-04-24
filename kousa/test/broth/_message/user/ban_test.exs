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
                payload: %Ban{userId: ^uuid, reason: "foobar"}
              }} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "user:ban",
                 "payload" => %{"userId" => uuid, "reason" => "foobar"},
                 "reference" => UUID.uuid4()
               })

      # short form also allowed
      assert {:ok,
              %{
                payload: %Ban{userId: ^uuid, reason: "foobar"}
              }} =
               BrothTest.Support.Message.validate(%{
                 "op" => "user:ban",
                 "p" => %{"userId" => uuid, "reason" => "foobar"},
                 "ref" => UUID.uuid4()
               })
    end

    test "omitting the id is not allowed" do
      assert {:error, %{errors: %{userId: "can't be blank"}}} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "user:ban",
                 "payload" => %{"reason" => "foobar"},
                 "reference" => UUID.uuid4()
               })
    end

    test "omitting the reason is not allowed", %{uuid: uuid} do
      assert {:error, %{errors: %{reason: "can't be blank"}}} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "user:ban",
                 "payload" => %{"userId" => uuid},
                 "reference" => UUID.uuid4()
               })
    end

    test "omitting the reference is not allowed", %{uuid: uuid} do
      assert {:error, %{errors: [reference: {"is required for Broth.Message.User.Ban", _}]}} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "user:ban",
                 "payload" => %{"userId" => uuid, "reason" => "foobar"}
               })
    end
  end
end

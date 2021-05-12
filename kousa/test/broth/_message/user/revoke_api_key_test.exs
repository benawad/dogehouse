defmodule BrothTest.Message.User.RevokeApiKeyTest do
  use ExUnit.Case, async: true

  @moduletag :message

  alias Broth.Message.User.RevokeApiKey

  setup do
    {:ok, uuid: UUID.uuid4()}
  end

  describe "when you send an revoke_api_key message" do
    test "it populates userId", %{uuid: uuid} do
      assert {:ok,
              %{
                payload: %RevokeApiKey{userId: ^uuid}
              }} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "user:revoke_api_key",
                 "payload" => %{"userId" => uuid},
                 "reference" => UUID.uuid4()
               })

      # short form also allowed
      assert {:ok,
              %{
                payload: %RevokeApiKey{userId: ^uuid}
              }} =
               BrothTest.Support.Message.validate(%{
                 "op" => "user:revoke_api_key",
                 "p" => %{"userId" => uuid},
                 "ref" => UUID.uuid4()
               })
    end

    test "omitting the userId is not allowed" do
      assert {:error, %{errors: %{userId: "can't be blank"}}} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "user:revoke_api_key",
                 "payload" => %{},
                 "reference" => UUID.uuid4()
               })
    end

    test "omitting the reference is not allowed", %{uuid: uuid} do
      assert {:error,
              %{errors: [reference: {"is required for Broth.Message.User.RevokeApiKey", _}]}} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "user:revoke_api_key",
                 "payload" => %{"userId" => uuid}
               })
    end
  end
end

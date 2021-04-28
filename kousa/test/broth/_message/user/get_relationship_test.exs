defmodule BrothTest.Message.User.GetRelationshipTest do
  use ExUnit.Case, async: true

  @moduletag :message

  alias Broth.Message.User.GetRelationship

  setup do
    {:ok, uuid: UUID.uuid4()}
  end

  describe "when you send an get_relationship message" do
    test "an empty payload is ok.", %{uuid: uuid} do
      assert {:ok,
              %{
                payload: %GetRelationship{userId: ^uuid}
              }} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "user:get_relationship",
                 "payload" => %{"userId" => uuid},
                 "reference" => UUID.uuid4()
               })

      # short form also allowed
      assert {:ok,
              %{
                payload: %GetRelationship{userId: ^uuid}
              }} =
               BrothTest.Support.Message.validate(%{
                 "op" => "user:get_relationship",
                 "p" => %{"userId" => uuid},
                 "ref" => UUID.uuid4()
               })
    end

    test "userId parameter is required" do
      assert {:error, %{errors: %{userId: "can't be blank"}}} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "user:get_relationship",
                 "payload" => %{},
                 "reference" => UUID.uuid4()
               })
    end
  end
end

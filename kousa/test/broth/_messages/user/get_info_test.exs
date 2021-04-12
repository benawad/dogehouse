defmodule BrothTest.Message.User.GetInfoTest do
  use ExUnit.Case, async: true

  alias Broth.Message.User.GetInfo

  setup do
    {:ok, uuid: UUID.uuid4()}
  end

  describe "when you send an get_info message" do
    test "an empty payload is ok.", %{uuid: uuid} do
      assert {:ok,
              %{
                payload: %GetInfo{userId: ^uuid}
              }} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "user:get_info",
                 "payload" => %{"userId" => uuid},
                 "reference" => UUID.uuid4()
               })

      # short form also allowed
      assert {:ok,
              %{
                payload: %GetInfo{userId: ^uuid}
              }} =
               BrothTest.Support.Message.validate(%{
                 "op" => "user:get_info",
                 "p" => %{"userId" => uuid},
                 "ref" => UUID.uuid4()
               })
    end

    test "userId parameter is required" do
      assert {:error, %{errors: [userId: {"can't be blank", _}]}} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "user:get_info",
                 "payload" => %{},
                 "reference" => UUID.uuid4()
               })
    end
  end
end

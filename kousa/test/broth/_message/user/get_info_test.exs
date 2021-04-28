defmodule BrothTest.Message.User.GetInfoTest do
  use ExUnit.Case, async: true

  @moduletag :message

  alias Broth.Message.User.GetInfo

  setup do
    {:ok, uuid: UUID.uuid4()}
  end

  describe "when you send an get_info message" do
    test "you can supply the user id", %{uuid: uuid} do
      assert {:ok,
              %{
                payload: %GetInfo{userIdOrUsername: ^uuid}
              }} =
               BrothTest.Support.Message.validate(
                 %{
                   "operator" => "user:get_info",
                   "payload" => %{"userIdOrUsername" => uuid},
                   "reference" => UUID.uuid4()
                 },
                 %{user_id: UUID.uuid4()}
               )

      # short form also allowed
      assert {:ok,
              %{
                payload: %GetInfo{userIdOrUsername: ^uuid}
              }} =
               BrothTest.Support.Message.validate(
                 %{
                   "op" => "user:get_info",
                   "p" => %{"userIdOrUsername" => uuid},
                   "ref" => UUID.uuid4()
                 },
                 %{user_id: UUID.uuid4()}
               )
    end

    # @todo
    # test "an empty payload is ok, it assumes self." do
    #   uuid = UUID.uuid4()
    #   state = %{user_id: uuid}

    #   assert {:ok, %{payload: %GetInfo{userIdOrUsername: ^uuid}}} =
    #            BrothTest.Support.Message.validate(
    #              %{
    #                "operator" => "user:get_info",
    #                "payload" => %{},
    #                "reference" => UUID.uuid4()
    #              },
    #              state
    #            )
    # end
  end
end

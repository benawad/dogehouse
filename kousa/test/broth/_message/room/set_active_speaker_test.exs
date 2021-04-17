defmodule BrothTest.Message.Room.SetActiveSpeakerTest do
  use ExUnit.Case, async: true
  use KousaTest.Support.EctoSandbox

  alias Beef.Schemas.User
  alias Beef.Users
  alias BrothTest.WsClient
  alias BrothTest.WsClientFactory
  alias KousaTest.Support.Factory

  require WsClient

  setup do
    user = Factory.create(User)
    client_ws = WsClientFactory.create_client_for(user)

    {:ok, user: user, client_ws: client_ws}
  end

  test "but write this plz"

  #  describe "when you send an leave message" do
  #    test "an empty payload is ok.", %{uuid: uuid} do
  #      assert {:ok, %{payload: %GetInfo{roomId: ^uuid}}} =
  #               BrothTest.Support.Message.validate(%{
  #                 "operator" => "room:get_info",
  #                 "payload" => %{roomId: uuid},
  #                 "reference" => UUID.uuid4()
  #               })
  #
  #      # short form also allowed
  #      assert {:ok, %{payload: %GetInfo{roomId: ^uuid}}} =
  #               BrothTest.Support.Message.validate(%{
  #                 "op" => "room:get_info",
  #                 "p" => %{roomId: uuid},
  #                 "ref" => UUID.uuid4()
  #               })
  #    end
  #
  #    test "roomId parameter is required" do
  #      assert {:ok, %{payload: %GetInfo{roomId: nil}}} =
  #               BrothTest.Support.Message.validate(%{
  #                 "operator" => "room:get_info",
  #                 "payload" => %{},
  #                 "reference" => UUID.uuid4()
  #               })
  #    end
  #  end
end

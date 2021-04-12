defmodule BrothTest.Message.Auth.RequestTest do
  use ExUnit.Case, async: true
  
  @moduletag :message

  alias Broth.Message.Auth.Request

  setup do
    {:ok, uuid: UUID.uuid4()}
  end

  describe "when you send a block message" do
    test "it populates userId", %{uuid: uuid} do
      assert {:ok,
              %{
                payload: %Request{
                  accessToken: "foo",
                  refreshToken: "bar",
                  platform: "baz",
                  reconnectToVoice: false,
                  muted: false
                }
              }} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "auth:request",
                 "payload" => %{
                   "accessToken" => "foo",
                   "refreshToken" => "bar",
                   "platform" => "baz",
                   "reconnectToVoice" => false,
                   "muted" => false
                 }
               })

      # short form also allowed
      assert {:ok,
              %{
                payload: %Request{
                  accessToken: "foo",
                  refreshToken: "bar",
                  platform: "baz",
                  reconnectToVoice: false,
                  muted: false
                }
              }} =
               BrothTest.Support.Message.validate(%{
                 "op" => "auth:request",
                 "p" => %{
                   "accessToken" => "foo",
                   "refreshToken" => "bar",
                   "platform" => "baz",
                   "reconnectToVoice" => false,
                   "muted" => false
                 }
               })
    end

    test "omitting the userId is not allowed" do
      assert {:error, %{errors: [accessToken: {"can't be blank", _}]}} =
               BrothTest.Support.Message.validate(%{
                 "op" => "auth:request",
                 "p" => %{
                   "refreshToken" => "bar",
                   "platform" => "baz",
                   "reconnectToVoice" => false,
                   "muted" => false
                 }
               })
    end
  end
end

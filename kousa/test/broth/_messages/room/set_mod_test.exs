defmodule BrothTest.Message.Room.SetAuth do
  use ExUnit.Case, async: true

  alias Broth.Message.Room.SetAuth

  setup do
    {:ok, uuid: UUID.uuid4()}
  end

  describe "when you send an set mod message" do
    test "it validates", %{uuid: uuid} do
      assert {:ok,
              %{
                payload: %SetAuth{userId: ^uuid, level: :mod}
              }} =
               Broth.Message.validate(%{
                 "operator" => "room:set_auth",
                 "payload" => %{"userId" => uuid, "level" => "mod"}
               })

               assert {:ok,
               %{
                 payload: %SetAuth{userId: ^uuid, level: :owner}
               }} =
                Broth.Message.validate(%{
                  "operator" => "room:set_auth",
                  "payload" => %{"userId" => uuid, "level" => "owner"}
                })

                assert {:ok,
                %{
                  payload: %SetAuth{userId: ^uuid, level: :user}
                }} =
                 Broth.Message.validate(%{
                   "operator" => "room:set_auth",
                   "payload" => %{"userId" => uuid, "level" => "user"}
                 })


      # short form also allowed
      assert {:ok,
              %{
                payload: %SetAuth{userId: ^uuid, level: :mod}
              }} =
               Broth.Message.validate(%{
                 "op" => "room:set_auth",
                 "p" => %{"userId" => uuid, "level" => "mod"}
               })
    end

    test "omitting the userId is not allowed" do
      assert {:error, %{errors: [userId: {"can't be blank", _}]}} =
               Broth.Message.validate(%{
                 "operator" => "room:set_auth",
                 "payload" => %{"level" => "mod"}
               })
    end

    test "omitting level is not allowed", %{uuid: uuid} do
      assert {:error, %{errors: [level: {"can't be blank", _}]}} =
               Broth.Message.validate(%{
                 "operator" => "room:set_auth",
                 "payload" => %{"userId" => uuid}
               })
    end

    test "level must be the correct form", %{uuid: uuid} do
      assert {:error, %{errors: [level: {"is invalid", _}]}} =
               Broth.Message.validate(%{
                 "operator" => "room:set_auth",
                 "payload" => %{"userId" => uuid, "level" => "admin"}
               })
    end
  end
end

defmodule BrothTest.Message.User.BanTest do
  use ExUnit.Case, async: true

  alias Broth.Message.User.Ban

  setup do
    {:ok, uuid: UUID.uuid4()}
  end

  describe "when you send an ban message" do
    test "it populates userId", %{uuid: uuid} do
      assert {:ok,
              %{
                payload: %Ban{userId: ^uuid}
              }} =
               Broth.Message.validate(%{
                 "operator" => "user:ban",
                 "payload" => %{"userId" => uuid}
               })

      # short form also allowed
      assert {:ok,
              %{
                payload: %Ban{userId: ^uuid}
              }} =
               Broth.Message.validate(%{
                 "op" => "user:ban",
                 "p" => %{"userId" => uuid}
               })
    end

    test "omitting the userId is not allowed" do
      assert {:error, %{errors: [userId: {"can't be blank", _}]}} =
               Broth.Message.validate(%{
                 "operator" => "user:ban",
                 "payload" => %{}
               })
    end
  end
end

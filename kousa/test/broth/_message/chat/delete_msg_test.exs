defmodule BrothTest.Message.Chat.DeleteTest do
  use ExUnit.Case, async: true

  @moduletag :message

  alias Broth.Message.Chat.Delete

  describe "when you send a delete_msg message" do
    test "it populates userId" do
      msg_id = UUID.uuid4()
      user_id = UUID.uuid4()

      assert {:ok,
              %{
                payload: %Delete{
                  messageId: ^msg_id,
                  userId: ^user_id
                }
              }} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "chat:delete",
                 "payload" => %{"messageId" => msg_id, "userId" => user_id}
               })

      # short form also allowed
      assert {:ok,
              %{
                payload: %Delete{
                  messageId: ^msg_id,
                  userId: ^user_id
                }
              }} =
               BrothTest.Support.Message.validate(%{
                 "op" => "chat:delete",
                 "p" => %{"messageId" => msg_id, "userId" => user_id}
               })
    end

    test "messageId must be well-formed" do
      id = UUID.uuid4()

      assert {:error, %{errors: %{messageId: "is invalid"}}} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "chat:delete",
                 "payload" => %{"userId" => id, "messageId" => "aaa"}
               })

      assert {:error, %{errors: %{messageId: "is invalid"}}} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "chat:delete",
                 "payload" => %{"userId" => id, "messageId" => %{"foo" => "bar"}}
               })
    end

    test "userId must be well-formed" do
      id = UUID.uuid4()

      assert {:error, %{errors: %{userId: "is invalid"}}} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "chat:delete",
                 "payload" => %{"messageId" => id, "userId" => "aaa"}
               })

      assert {:error, %{errors: %{userId: "is invalid"}}} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "chat:delete",
                 "payload" => %{"messageId" => id, "userId" => %{"foo" => "bar"}}
               })
    end

    test "messageId required" do
      id = UUID.uuid4()

      assert {:error, %{errors: %{messageId: "can't be blank"}}} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "chat:delete",
                 "payload" => %{"userId" => id}
               })
    end

    test "userId required" do
      id = UUID.uuid4()

      assert {:error, %{errors: %{userId: "can't be blank"}}} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "chat:delete",
                 "payload" => %{"messageId" => id}
               })
    end
  end
end

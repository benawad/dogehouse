defmodule BrothTest.Message.Chat.DeleteMsgTest do
  use ExUnit.Case, async: true
  
  @moduletag :message

  alias Broth.Message.Chat.DeleteMsg

  describe "when you send a delete_msg message" do
    test "it populates userId" do
      msg_id = UUID.uuid4()
      user_id = UUID.uuid4()

      assert {:ok,
              %{
                payload: %DeleteMsg{
                  messageId: ^msg_id,
                  userId: ^user_id
                }
              }} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "chat:delete_msg",
                 "payload" => %{"messageId" => msg_id, "userId" => user_id}
               })

      # short form also allowed
      assert {:ok,
              %{
                payload: %DeleteMsg{
                  messageId: ^msg_id,
                  userId: ^user_id
                }
              }} =
               BrothTest.Support.Message.validate(%{
                 "op" => "chat:delete_msg",
                 "p" => %{"messageId" => msg_id, "userId" => user_id}
               })
    end

    test "messageId must be well-formed" do
      id = UUID.uuid4()

      assert {:error, %{errors: [messageId: {"is invalid", _}]}} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "chat:delete_msg",
                 "payload" => %{"userId" => id, "messageId" => "aaa"}
               })

      assert {:error, %{errors: [messageId: {"is invalid", _}]}} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "chat:delete_msg",
                 "payload" => %{"userId" => id, "messageId" => %{"foo" => "bar"}}
               })
    end

    test "userId must be well-formed" do
      id = UUID.uuid4()

      assert {:error, %{errors: [userId: {"is invalid", _}]}} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "chat:delete_msg",
                 "payload" => %{"messageId" => id, "userId" => "aaa"}
               })

      assert {:error, %{errors: [userId: {"is invalid", _}]}} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "chat:delete_msg",
                 "payload" => %{"messageId" => id, "userId" => %{"foo" => "bar"}}
               })
    end

    test "messageId required" do
      id = UUID.uuid4()

      assert {:error, %{errors: [messageId: {"can't be blank", _}]}} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "chat:delete_msg",
                 "payload" => %{"userId" => id}
               })
    end

    test "userId required" do
      id = UUID.uuid4()

      assert {:error, %{errors: [userId: {"can't be blank", _}]}} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "chat:delete_msg",
                 "payload" => %{"messageId" => id}
               })
    end
  end
end

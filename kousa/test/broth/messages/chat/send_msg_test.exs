defmodule BrothTest.Message.Chat.SendMsgTest do
  use ExUnit.Case, async: true

  alias Broth.Message.Types.ChatToken
  alias Broth.Message.Chat.SendMsg

  describe "when you send a send_msg message" do
    test "it populates userId" do
      assert {:ok,
              %{
                payload: %SendMsg{
                  tokens: [
                    %ChatToken{
                      type: :text,
                      value: "foobar"
                    }
                  ],
                  whispered_to: nil
                }
              }} =
               Broth.Message.validate(%{
                 "operator" => "chat:send_msg",
                 "payload" => %{
                   "tokens" => [
                     %{
                       "type" => "text",
                       "value" => "foobar"
                     }
                   ]
                 }
               })

      # short form also allowed
      assert {:ok,
              %{
                payload: %SendMsg{
                  tokens: [
                    %ChatToken{
                      type: :text,
                      value: "foobar"
                    }
                  ]
                }
              }} =
               Broth.Message.validate(%{
                 "op" => "chat:send_msg",
                 "p" => %{
                   "tokens" => [
                     %{
                       "type" => "text",
                       "value" => "foobar"
                     }
                   ]
                 }
               })
    end

    test "empty list is forbidden" do
      assert {:error, %{errors: [tokens: {"must not be empty", _}]}} =
               Broth.Message.validate(%{
                 "operator" => "chat:send_msg",
                 "payload" => %{
                   "tokens" => []
                 }
               })
    end

    test "non-lists are forbidden" do
      assert {:error, %{errors: [tokens: {"is invalid", _}]}} =
               Broth.Message.validate(%{
                 "operator" => "chat:send_msg",
                 "payload" => %{
                   "tokens" => "foo"
                 }
               })

      assert {:error, %{errors: [tokens: {"is invalid", _}]}} =
               Broth.Message.validate(%{
                 "operator" => "chat:send_msg",
                 "payload" => %{
                   "tokens" => %{"foo" => "bar"}
                 }
               })
    end

    @message_character_limit Application.compile_env!(:kousa, :message_character_limit)

    test "a message that's too long fails" do
      too_long_message =
        List.duplicate(
          %{"type" => "text", "value" => "a"},
          @message_character_limit + 1
        )

      assert {:error, %{errors: [tokens: {"combined length too long", _}]}} =
               Broth.Message.validate(%{
                 "operator" => "chat:send_msg",
                 "payload" => %{
                   "tokens" => too_long_message
                 }
               })
    end

    test "a message with invalid tokens are forbidden" do
      assert {:error, %{errors: [tokens: {"is invalid", _}]}} =
               Broth.Message.validate(%{
                 "operator" => "chat:send_msg",
                 "payload" => %{
                   "tokens" => ["a"]
                 }
               })
    end
  end

  describe "a send_msg message with a whispered list" do
    @tokens [%{"type" => "text", "value" => "foobar"}]
    test "will populate one uuid into whispered_to" do
      uuid = UUID.uuid4()

      assert {:ok, %{payload: %{whispered_to: [^uuid]}}} =
               Broth.Message.validate(%{
                 "operator" => "chat:send_msg",
                 "payload" => %{
                   "tokens" => @tokens,
                   "whispered_to" => [uuid]
                 }
               })
    end

    test "will populate multiple uuids into whispered_to" do
      uuid1 = UUID.uuid4()
      uuid2 = UUID.uuid4()

      assert {:ok, %{payload: %{whispered_to: [^uuid1, ^uuid2]}}} =
               Broth.Message.validate(%{
                 "operator" => "chat:send_msg",
                 "payload" => %{
                   "tokens" => @tokens,
                   "whispered_to" => [uuid1, uuid2]
                 }
               })
    end

    test "doesn't populate wrong types" do
      assert {:error, %{errors: [whispered_to: {"is invalid", _}]}} =
               Broth.Message.validate(%{
                 "operator" => "chat:send_msg",
                 "payload" => %{
                   "tokens" => @tokens,
                   "whispered_to" => "aaa"
                 }
               })

      assert {:error, %{errors: [whispered_to: {"is invalid", _}]}} =
               Broth.Message.validate(%{
                 "operator" => "chat:send_msg",
                 "payload" => %{
                   "tokens" => @tokens,
                   "whispered_to" => %{"foo" => "bar"}
                 }
               })

      assert {:error, %{errors: [whispered_to: {"is invalid", _}]}} =
               Broth.Message.validate(%{
                 "operator" => "chat:send_msg",
                 "payload" => %{
                   "tokens" => @tokens,
                   "whispered_to" => ["aaa"]
                 }
               })
    end
  end
end

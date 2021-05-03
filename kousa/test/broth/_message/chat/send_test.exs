defmodule BrothTest.Message.Chat.SendTest do
  use ExUnit.Case, async: true

  @moduletag :message

  alias Broth.Message.Types.ChatToken
  alias Broth.Message.Chat.Send

  describe "when you send a send_msg message" do
    test "it populates userId" do
      assert {:ok,
              %{
                payload: %Send{
                  tokens: [
                    %ChatToken{
                      type: :text,
                      value: "foobar"
                    }
                  ],
                  whisperedTo: []
                }
              }} =
               BrothTest.Support.Message.validate(%{
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
                payload: %Send{
                  tokens: [
                    %ChatToken{
                      type: :text,
                      value: "foobar"
                    }
                  ]
                }
              }} =
               BrothTest.Support.Message.validate(%{
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
      assert {:error, %{errors: %{tokens: "must not be empty"}}} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "chat:send_msg",
                 "payload" => %{
                   "tokens" => []
                 }
               })
    end

    test "non-lists are forbidden" do
      assert {:error, %{errors: %{tokens: "is invalid"}}} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "chat:send_msg",
                 "payload" => %{
                   "tokens" => "foo"
                 }
               })

      assert {:error, %{errors: %{tokens: "is invalid"}}} =
               BrothTest.Support.Message.validate(%{
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

      assert {:error, %{errors: %{tokens: "combined length too long"}}} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "chat:send_msg",
                 "payload" => %{
                   "tokens" => too_long_message
                 }
               })
    end

    test "a message with invalid tokens are forbidden" do
      assert {:error, %{errors: %{tokens: "is invalid"}}} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "chat:send_msg",
                 "payload" => %{
                   "tokens" => ["a"]
                 }
               })
    end
  end

  describe "a send_msg message with a whispered list" do
    @tokens [%{"type" => "text", "value" => "foobar"}]
    test "will populate one uuid into whisperedTo" do
      uuid = UUID.uuid4()

      assert {:ok, %{payload: %{whisperedTo: [^uuid]}}} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "chat:send_msg",
                 "payload" => %{
                   "tokens" => @tokens,
                   "whisperedTo" => [uuid]
                 }
               })
    end

    test "will populate multiple uuids into whisperedTo" do
      uuid1 = UUID.uuid4()
      uuid2 = UUID.uuid4()

      assert {:ok, %{payload: %{whisperedTo: [^uuid1, ^uuid2]}}} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "chat:send_msg",
                 "payload" => %{
                   "tokens" => @tokens,
                   "whisperedTo" => [uuid1, uuid2]
                 }
               })
    end

    test "doesn't populate wrong types" do
      assert {:error, %{errors: %{whisperedTo: "is invalid"}}} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "chat:send_msg",
                 "payload" => %{
                   "tokens" => @tokens,
                   "whisperedTo" => "aaa"
                 }
               })

      assert {:error, %{errors: %{whisperedTo: "is invalid"}}} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "chat:send_msg",
                 "payload" => %{
                   "tokens" => @tokens,
                   "whisperedTo" => %{"foo" => "bar"}
                 }
               })

      assert {:error, %{errors: %{whisperedTo: "is invalid"}}} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "chat:send_msg",
                 "payload" => %{
                   "tokens" => @tokens,
                   "whisperedTo" => ["aaa"]
                 }
               })
    end
  end
end

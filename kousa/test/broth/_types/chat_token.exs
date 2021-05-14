defmodule BrothTest.Message.Types.ChatToken do
  use ExUnit.Case, async: true

  alias Broth.Message.Types.ChatToken
  alias Ecto.Changeset

  defp validate(map) do
    %ChatToken{}
    |> ChatToken.changeset(map)
    |> Changeset.apply_action(:validate)
  end

  @message_character_limit Application.compile_env(:kousa, :message_character_limit)

  describe "a chat token which is of type text" do
    test "can be validated" do
      assert {:ok,
              %ChatToken{
                type: :text,
                value: "foobar"
              }} = validate(%{"type" => "text", "value" => "foobar"})
    end

    test "short forms work too" do
      assert {:ok,
              %ChatToken{
                type: :text,
                value: "foobar"
              }} = validate(%{"t" => "text", "v" => "foobar"})
    end

    test "is invalid if it has zero length" do
      assert {:error, %{errors: [value: {"can't be blank", _}]}} =
               validate(%{"type" => "text", "value" => ""})
    end

    test "is invalid if it exceeds the message character limit" do
      too_many_as =
        ?a
        |> List.duplicate(@message_character_limit + 1)
        |> List.to_string()

      assert {:error, %{errors: [value: {"should be at most" <> _, _}]}} =
               validate(%{"type" => "text", "value" => too_many_as})
    end
  end

  describe "a chat token which is of type mention" do
    test "can be validated" do
      assert {:ok,
              %ChatToken{
                type: :mention,
                value: "foobar"
              }} = validate(%{"type" => "mention", "value" => "foobar"})
    end
  end

  describe "a chat token which is of type emote" do
    test "can be validated" do
      assert {:ok,
              %ChatToken{
                type: :emote,
                value: "foobar"
              }} = validate(%{"type" => "emote", "value" => "foobar"})
    end
  end

  describe "a chat token which is of type block" do
    test "can be validated" do
      assert {:ok,
              %ChatToken{
                type: :block,
                value: "this is a code block"
              }} = validate(%{"type" => "block", "value" => "this is a code block"})
    end
  end

  describe "a chat token which is of type link" do
    test "is valid if it's an https link" do
      assert {:ok,
              %ChatToken{
                type: :link,
                value: "https://github.com"
              }} = validate(%{"type" => "link", "value" => "https://github.com"})
    end

    test "is valid if it's an http link" do
      assert {:ok,
              %ChatToken{
                type: :link,
                value: "http://github.com"
              }} = validate(%{"type" => "link", "value" => "http://github.com"})
    end

    test "is invalid if it's an unspported scheme" do
      assert {:error, %{errors: [value: {"invalid url", _}]}} =
               validate(%{"type" => "link", "value" => "file://home/foo/bar"})
    end

    test "is invalid if it doesn't look like a uri at all" do
      assert {:error, %{errors: [value: {"invalid url", _}]}} =
               validate(%{"type" => "link", "value" => "foobar"})
    end
  end

  describe "a chat token which is of type emoji" do
    test "can be validated" do
      assert {:ok,
              %ChatToken{
                type: :emoji,
                value: "🤔"
              }} = validate(%{"type" => "emoji", "value" => "🤔"})
    end
  end

  describe "a chat token which is missing the field" do
    test "type is invalid" do
      assert {:error, %{errors: [type: {"can't be blank", _}]}} = validate(%{"value" => "foobar"})
    end

    test "value is invalid" do
      assert {:error, %{errors: [value: {"can't be blank", _}]}} = validate(%{"type" => "text"})
    end
  end

  describe "a chat token with an invalid" do
    test "type is invalid" do
      assert {:error, %{errors: [type: {"is invalid", _}]}} =
               validate(%{"type" => "quux", "value" => "foobar"})
    end

    test "value is invalid" do
      assert {:error, %{errors: [value: {"is invalid", _}]}} =
               validate(%{"type" => "text", "value" => %{"foo" => "bar"}})
    end
  end

  describe "a chat token encodes" do
    test "to the short form" do
      uuid = UUID.uuid4()

      assert Jason.encode!(
               %ChatToken{
                 type: :text,
                 value: "foobar"
               },
               pretty: true
             ) ==
               String.trim("""
               {
                 "t": "text",
                 "v": "foobar"
               }
               """)
    end
  end
end

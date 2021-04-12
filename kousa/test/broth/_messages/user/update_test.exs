defmodule BrothTest.Message.User.UpdateTest do
  use ExUnit.Case, async: true

  alias Beef.Schemas.User
  alias Broth.Message.User.Update

  setup do
    {:ok, uuid: UUID.uuid4()}
  end

  describe "when you send an update message to change muted state" do
    test "it populates update fields", %{uuid: uuid} do
      assert {:ok,
              %{
                payload: %Update{muted: true}
              }} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "user:update",
                 "payload" => %{"muted" => true},
                 "reference" => uuid
               })

      # short form also allowed
      assert {:ok,
              %{
                payload: %Update{muted: false}
              }} =
               BrothTest.Support.Message.validate(%{
                 "op" => "user:update",
                 "p" => %{"muted" => false},
                 "ref" => uuid
               })
    end

    test "omitting the reference is not allowed" do
      assert {:error, %{errors: [reference: {"is required for Broth.Message.User.Update", _}]}} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "user:update",
                 "payload" => %{"muted" => true}
               })
    end

    test "providing the wrong datatype for muted state is disallowed", %{uuid: uuid} do
      assert {:error, %{errors: [muted: {"is invalid", _}]}} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "user:update",
                 "payload" => %{"muted" => "foobar"},
                 "reference" => uuid
               })

      assert {:error, %{errors: [muted: {"is invalid", _}]}} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "user:update",
                 "payload" => %{"muted" => ["foobar", "barbaz"]},
                 "reference" => uuid
               })
    end
  end
end

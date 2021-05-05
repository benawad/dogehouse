defmodule BrothTest.Message.User.UpdateTest do
  use ExUnit.Case, async: true
  use KousaTest.Support.EctoSandbox

  @moduletag :message

  alias Beef.Schemas.User
  alias KousaTest.Support.Factory

  setup do
    # this "UNIT" test requires the db because the message gets
    # initialized off of information in the database.
    user = Factory.create(User)
    state = %Broth.SocketHandler{user: user}
    {:ok, uuid: UUID.uuid4(), state: state}
  end

  describe "when you send an update message to change muted state" do
    test "it populates update fields", %{uuid: uuid, state: state} do
      assert {:ok, %{payload: %User{muted: true, deafened: true}}} =
               BrothTest.Support.Message.validate(
                 %{
                   "operator" => "user:update",
                   "payload" => %{"muted" => true, "deafened" => true},
                   "reference" => uuid
                 },
                 state
               )

      # short form also allowed
      assert {:ok, %{payload: %User{muted: false, deafened: false}}} =
               BrothTest.Support.Message.validate(
                 %{
                   "op" => "user:update",
                   "p" => %{"muted" => false, "deafened" => false},
                   "ref" => uuid
                 },
                 state
               )
    end

    test "omitting the reference is not allowed", %{state: state} do
      assert {:error, %{errors: [reference: {"is required for Broth.Message.User.Update", _}]}} =
               BrothTest.Support.Message.validate(
                 %{
                   "operator" => "user:update",
                   "payload" => %{"muted" => true, "deafened" => true}
                 },
                 state
               )
    end

    test "providing the wrong datatype for muted state is disallowed",
         %{uuid: uuid, state: state} do
      assert {:error, %{errors: %{muted: "is invalid", deafened: "is invalid"}}} =
               BrothTest.Support.Message.validate(
                 %{
                   "operator" => "user:update",
                   "payload" => %{"muted" => "foobar", "deafened" => "barfoo"},
                   "reference" => uuid
                 },
                 state
               )

      assert {:error, %{errors: %{muted: "is invalid", deafened: "is invalid"}}} =
               BrothTest.Support.Message.validate(
                 %{
                   "operator" => "user:update",
                   "payload" => %{
                     "muted" => ["foobar", "barbaz"],
                     "deafened" => ["foobar", "barbaz"]
                   },
                   "reference" => uuid
                 },
                 state
               )
    end
  end

  describe "when you send an update message to change the username" do
    test "it populates update fields", %{uuid: uuid, state: state} do
      assert {:ok, %{payload: %User{username: "foobar"}}} =
               BrothTest.Support.Message.validate(
                 %{
                   "operator" => "user:update",
                   "payload" => %{"username" => "foobar"},
                   "reference" => uuid
                 },
                 state
               )
    end

    test "it accepts good key string for whisperPrivacySetting", %{uuid: uuid, state: state} do
      assert {:ok, %{payload: %User{whisperPrivacySetting: :off}}} =
               BrothTest.Support.Message.validate(
                 %{
                   "operator" => "user:update",
                   "payload" => %{"whisperPrivacySetting" => "off"},
                   "reference" => uuid
                 },
                 state
               )
    end

    test "it rejects bad key for whisperPrivacySetting", %{uuid: uuid, state: state} do
      assert {:error, %{errors: %{whisperPrivacySetting: "is invalid"}}} =
               BrothTest.Support.Message.validate(
                 %{
                   "operator" => "user:update",
                   "payload" => %{"whisperPrivacySetting" => "pancake"},
                   "reference" => uuid
                 },
                 state
               )
    end

    test "it rejects attempting to delete the username", %{uuid: uuid, state: state} do
      assert {:error, %{errors: %{username: "can't be blank"}}} =
               BrothTest.Support.Message.validate(
                 %{
                   "operator" => "user:update",
                   "payload" => %{"username" => ""},
                   "reference" => uuid
                 },
                 state
               )

      assert {:error, %{errors: %{username: "can't be blank"}}} =
               BrothTest.Support.Message.validate(
                 %{
                   "operator" => "user:update",
                   "payload" => %{"username" => nil},
                   "reference" => uuid
                 },
                 state
               )
    end
  end
end

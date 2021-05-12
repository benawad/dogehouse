defmodule BrothTest.Message.User.AdminUpdateTest do
  use ExUnit.Case, async: true

  @moduletag :message

  alias Broth.Message.User.AdminUpdate

  setup do
    {:ok, username: UUID.uuid4()}
  end

  describe "when you send an admin_update message" do
    # test "it populates username", %{username: username} do
    #   assert {:ok,
    #           %{
    #             payload: %AdminUpdate{
    #               username: ^username,
    #               user: %{
    #                 staff: true,
    #                 contributions: 100
    #               }
    #             }
    #           }} =
    #            BrothTest.Support.Message.validate(%{
    #              "operator" => "user:admin_update",
    #              "payload" => %{
    #                "username" => username,
    #                "user" => %{"staff" => true, "contributions" => 100}
    #              },
    #              "reference" => UUID.uuid4()
    #            })

    #   # short form also allowed
    #   assert {:ok,
    #           %{
    #             payload: %AdminUpdate{
    #               username: ^username,
    #               user: %{
    #                 staff: true,
    #                 contributions: 100
    #               }
    #             }
    #           }} =
    #            BrothTest.Support.Message.validate(%{
    #              "op" => "user:admin_update",
    #              "p" => %{
    #                "username" => username,
    #                "user" => %{"staff" => true, "contributions" => 100}
    #              },
    #              "ref" => UUID.uuid4()
    #            })
    # end

    # test "omitting the username is not allowed" do
    #   assert {:error, %{errors: %{username: "can't be blank"}}} =
    #            BrothTest.Support.Message.validate(%{
    #              "operator" => "user:admin_update",
    #              "payload" => %{"user" => %{"staff" => true, "contributions" => 100}},
    #              "reference" => UUID.uuid4()
    #            })
    # end

    # test "omitting the reference is not allowed", %{username: username} do
    #   assert {:error,
    #           %{errors: [reference: {"is required for Broth.Message.User.AdminUpdate", _}]}} =
    #            BrothTest.Support.Message.validate(%{
    #              "operator" => "user:admin_update",
    #              "payload" => %{
    #                "username" => username,
    #                "user" => %{"staff" => true, "contributions" => 100}
    #              }
    #            })
    # end

    # test "omitting staff is allowed", %{username: username} do
    #   assert {:ok,
    #           %{
    #             payload: %AdminUpdate{
    #               username: ^username,
    #               user: %{
    #                 contributions: 100
    #               }
    #             }
    #           }} =
    #            BrothTest.Support.Message.validate(%{
    #              "op" => "user:admin_update",
    #              "p" => %{
    #                "username" => username,
    #                "user" => %{"contributions" => 100}
    #              },
    #              "ref" => UUID.uuid4()
    #            })
    # end

    # test "omitting contributions is allowed", %{username: username} do
    #   assert {:ok,
    #           %{
    #             payload: %AdminUpdate{
    #               username: ^username,
    #               user: %{
    #                 staff: true
    #               }
    #             }
    #           }} =
    #            BrothTest.Support.Message.validate(%{
    #              "op" => "user:admin_update",
    #              "p" => %{
    #                "username" => username,
    #                "user" => %{"staff" => true}
    #              },
    #              "ref" => UUID.uuid4()
    #            })
    # end
  end
end

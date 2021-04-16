defmodule BrothTest.Message.Room.GetScheduled do
  use ExUnit.Case, async: true

  @moduletag :message

  alias Broth.Message.Room.GetScheduled

  setup do
    {:ok, uuid: UUID.uuid4()}
  end

  describe "when you send an get_scheduled message" do
    test "an empty payload is ok.", %{uuid: uuid} do
      assert {:ok,
              %{
                payload: %GetScheduled{all: true}
              }} =
               BrothTest.Support.Message.validate(%{
                 "operator" => "room:get_scheduled",
                 "payload" => %{},
                 "reference" => UUID.uuid4()
               })

      # short form also allowed
      assert {:ok,
              %{
                payload: %GetScheduled{all: true}
              }} =
               BrothTest.Support.Message.validate(%{
                 "op" => "room:get_scheduled",
                 "p" => %{},
                 "ref" => UUID.uuid4()
               })
    end

    test "supplying all parameter is possible" do
      assert {:ok,
      %{
        payload: %GetScheduled{all: false}
      }} =
       BrothTest.Support.Message.validate(%{
         "operator" => "room:get_scheduled",
         "payload" => %{"all" => false},
         "reference" => UUID.uuid4()
       })

       assert {:ok,
       %{
         payload: %GetScheduled{all: true}
       }} =
        BrothTest.Support.Message.validate(%{
          "operator" => "room:get_scheduled",
          "payload" => %{"all" => true},
          "reference" => UUID.uuid4()
        })
    end
  end
end

defmodule Broth.Translator do
  import Kousa.Utils.Version
  alias Broth.Translator.V0_1_0
  require V0_1_0

  def translate_inbound(message) when V0_1_0.translates(message) do
    V0_1_0.translate(message)
    # pipe into V0_2_0 translation layer here.
  end

  # add future V0_2_0 abstraction layer here.
  def translate_inbound(message), do: message

  
  #############################################################################
  ## OUTBOUND CONVERSION

  def convert_outbound(map, original = %{version: ~v(0.1.0)}) do
    %{op: "fetch_done", d: map.p}
    |> add_ref(map)
    |> add_err(map)
    |> convert_outbound_0_1_0(original.inbound_operator)
  end

  def convert_outbound(map, _), do: map

  defp add_ref(map, %{ref: ref}), do: Map.put(map, :fetchId, ref)
  defp add_ref(map, _), do: map

  defp add_err(map, %{e: err}), do: Map.put(map, :e, err)
  defp add_err(map, _), do: map

  def convert_outbound_0_1_0(map, "auth:request") do
    %{map | op: "auth-good", d: %{user: %{id: map.d.id}}}
  end

  def convert_outbound_0_1_0(map, "user:ban") do
    %{map | op: "ban_done", d: %{worked: !map[:e]}}
  end

  def convert_outbound_0_1_0(map, "room:create") do
    %{map | d: %{room: map.d}}
  end

  def convert_outbound_0_1_0(map = %{e: errors}, "user:update") do
    %{map | d: %{isUsernameTaken: errors =~ "has already been taken"}}
  end

  def convert_outbound_0_1_0(map, "user:update") do
    %{map | d: %{isUsernameTaken: false}}
  end

  def convert_outbound_0_1_0(map, "user:get_relationship") do
    new_data =
      case map.d.relationship do
        nil -> %{followsYou: false, youAreFollowing: false}
        :follows -> %{followsYou: true, youAreFollowing: false}
        :following -> %{followsYou: false, youAreFollowing: true}
        :mutual -> %{followsYou: true, youAreFollowing: true}
      end

    %{map | d: new_data}
  end

  def convert_outbound_0_1_0(map, "room:update") do
    %{map | d: !Map.get(map, :e)}
  end

  def convert_outbound_0_1_0(map, "room:get_invite_list") do
    data = %{users: map.d.invites, nextCursor: map.d.nextCursor}
    %{map | op: "fetch_invite_list_done", d: data}
  end

  def convert_outbound_0_1_0(map, "user:get_following") do
    data = %{users: map.d.following, nextCursor: map.d.nextCursor}
    %{map | d: data}
  end

  def convert_outbound_0_1_0(map, "room:leave") do
    %{map | op: "you_left_room"}
  end

  # def convert_outbound_0_1_0(map, orig) do
  #  raise "foo"
  # end

  def convert_outbound_0_1_0(map, _), do: map
end

defmodule Kousa.Utils.UUID do
  @type t :: <<_::288>>

  # TODO: consider enforcing UUID4
  @hex Enum.to_list(?0..?9) ++ Enum.to_list(?a..?f) ++ Enum.to_list(?A..?F)

  @spec normalize(t | nil) :: {:ok, t | nil} | :invalid
  def normalize(
        <<a00, a01, a02, a03, a04, a05, a06, a07, ?-, a08, a09, a10, a11, ?-, a12, a13, a14, a15,
          ?-, a16, a17, a18, a19, ?-, a20, a21, a22, a23, a24, a25, a26, a27, a28, a29, a30, a31>>
      )
      when a00 in @hex and a01 in @hex and a02 in @hex and a03 in @hex and
             a04 in @hex and a05 in @hex and a06 in @hex and a07 in @hex and
             a08 in @hex and a09 in @hex and a10 in @hex and a11 in @hex and
             a12 in @hex and a13 in @hex and a14 in @hex and a15 in @hex and
             a16 in @hex and a17 in @hex and a18 in @hex and a19 in @hex and
             a20 in @hex and a21 in @hex and a22 in @hex and a23 in @hex and
             a24 in @hex and a25 in @hex and a26 in @hex and a27 in @hex and
             a28 in @hex and a29 in @hex and a30 in @hex and a31 in @hex do
    {:ok,
     <<lower(a00), lower(a01), lower(a02), lower(a03), lower(a04), lower(a05), lower(a06),
       lower(a07), ?-, lower(a08), lower(a09), lower(a10), lower(a11), ?-, lower(a12), lower(a13),
       lower(a14), lower(a15), ?-, lower(a16), lower(a17), lower(a18), lower(a19), ?-, lower(a20),
       lower(a21), lower(a22), lower(a23), lower(a24), lower(a25), lower(a26), lower(a27),
       lower(a28), lower(a29), lower(a30), lower(a31)>>}
  end

  def normalize(nil), do: {:ok, nil}

  def normalize(_), do: :invalid

  defp lower(char) when char in ?A..?F, do: char - 32
  defp lower(char), do: char

  # for convenience, an Ecto Changeset function
  import Ecto.Changeset

  def normalize(changeset = %{valid?: false}, _), do: changeset

  def normalize(changeset, field) do
    changeset
    |> get_change(field)
    |> normalize
    |> case do
      {:ok, nil} ->
        changeset

      {:ok, uuid} ->
        put_change(changeset, field, uuid)

      :invalid ->
        add_error(changeset, field, "is invalid")
    end
  end
end

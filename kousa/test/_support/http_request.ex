defmodule BrothTest.HttpRequest do
  def post(path, body, opts \\ []) do
    callers =
      self()
      |> :erlang.term_to_binary()
      |> Base.encode16()

    case :post
         |> Finch.build(
           "http://localhost:4001" <> path,
           [{"content-type", "application/json"}, {"user-agent", callers}] ++ opts,
           Jason.encode!(body)
         )
         |> Finch.request(BrothHttpRequests) do
      {:ok, %Finch.Response{body: body, status: 200}} ->
        {:ok, Jason.decode!(body)}

      x ->
        x
    end
  end
end

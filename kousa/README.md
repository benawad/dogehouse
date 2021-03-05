# Kousa - Elixir Backend

## Running Tests

`mix test`

Coverage report: `mix coveralls.html`.
Pretty information outputted into `cover/excoveralls.html`

## Autoformatting

`mix format`

## Style ENFORCEMENT

`mix credo --strict`

## for Elixir NOOBs:

general elixir conventions:

- a function that ends in `!` can crash on documented error conditions.
- `is_...` should only be used for guards; most boolean functions should be
  `...?` functions
- `fetch...` shuold return `{:ok, value}` or `:error`
- `fetch...!` shuold return `value` or crash if not present
- `get...` shuold return `value` or `nil`

`snake_case` not `camelCase` 
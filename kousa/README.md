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

General Elixir conventions:

- A function that ends in `!` can crash on documented error conditions.
- `is_...` should only be used for guards; most boolean functions should be
  `...?` functions
- `fetch...` should return `{:ok, value}` or `:error`
- `fetch...!` should return `value` or crash if not present
- `get...` should return `value` or `nil`

`snake_case` not `camelCase`

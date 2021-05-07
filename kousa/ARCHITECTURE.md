# Kousa Architecture Document

Kousa will roughly follow the HyperHypeBeast hexagonal, or
"functional core" architecture:

https://www.youtube.com/watch?v=yTkzNHF6rMs

Elixir contexts

1. `Beef` - Database, persistent state for Kousa
 - `Beef.Access` Nonmutating queries
 - `Beef.Mutations` Mutating queries
 - `Beef.Queries` Composable Ecto.Query fragments
 - `Beef.Schemas` Database table schemas
2. `Onion` - OTP-based transient state for Kousa
3. `Broth` - Web interface, routes, socket handler, everything that is being delivered to the client
 - `Broth.Messages` - Handles websocket messages
4. `Kousa` - OTP application, business logic, and common toolsets

NB: All of the module contexts will be part of the `:kousa` BEAM VM
application under the application supervision tree

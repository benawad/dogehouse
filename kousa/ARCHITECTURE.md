# Kousa Architecture Document

Kousa will roughly follow the HyperHypeBeast hexagonal, or
"functional core" architecture:

https://www.youtube.com/watch?v=yTkzNHF6rMs

Elixir contexts

1. `Beef` - Database, persistent state for Kousa
 - `Beef.Access` nonmutating queries
 - `Beef.Changesets` ingress validation logic
 - `Beef.Mutations` mutating queries
 - `Beef.Queries` composable Ecto.Query fragments
 - `Beef.Schemas` database table schemas
 - `Beef.Lenses` database struct logic
2. `Onion` - OTP-based transient state for Kousa
3. `Zuke` - Business logic (functional core) for Kousa
4. `Broth` - Web interface and contexts
5. `Kousa` - OTP Application core and common toolsets

NB: All of the module contexts will be part of the `:kousa` BEAM VM
application under the application supervision tree

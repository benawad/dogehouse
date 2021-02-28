# Kousa Architecture Document

Kousa will roughly follow the HyperHypeBeast hexagonal, or
"functional core" architecture:

https://www.youtube.com/watch?v=yTkzNHF6rMs

Elixir contexts

1. `Beef` - Database, the stateful center of the Kousa
 - `Beef.Access` nonmutating queries
 - `Beef.Changesets` ingress validation logic
 - `Beef.Mutations` mutating queries
 - `Beef.Queries` composable queries
 - `Beef.Schemas` database table schemas
 - `Beef.Lenses` database struct logic
2. `Zuke` - Business logic (functional core) for Kousa
3. `Broth` - Web interface and contexts

NB: All of the module contexts will be part of the `:kousa` BEAM VM
application under the application supervision tree
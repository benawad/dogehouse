# Kousa Architecture Document

Kousa roughly follows the hexagonal architecture:

https://en.wikipedia.org/wiki/Hexagonal_architecture_(software)

Elixir contexts

1. Beef - Database, the center of the Kousa
2. Zuke - Business logic for Kousa
3. Broth - Web interface and contexts

NB: All of the module contexts will be part of the `:kousa` BEAM VM
application under the application supervision tree
# ADDING NEW ROUTES TO THE WS API

1.  Add the name of the route to the manifest (Broth.Message.Manifest)
2.  Add the module type and some number to the enum (Broth.Message.Types.Operator)

3.  create the module in the appropriate Broth.Message.(\*) directory.
    - `use Broth.Message.Cast` if it's a cast, or `use Broth.Message.Call`
      if it's a Call, it will assume a `Reply` submodule.
    - if you need to put data in place using the websocket state, use
      `def initialize(state)` -> `%__MODULE__{...}`
    - you must provide a schema.  This sets up the contract for the
      contents of the payload message.
    - you must write a changeset/2 function.  This validates the
      payload.
    - you must write an execute/2 function.  This is passed to
      the changeset from before, and performs the action.
      -  if it's a cast, it expects `{:noreply, state}`
      -  if it's a call, it expects `{:reply, %__MODULE__{...}, state}`
         or `{:error, message}`
      - note that if you have a reply, the execute function must come
        *after* the Reply module definition.
    - if it's a schema that creates or edits a database table, refer to
      one of the other messages that creates or edits, for now.
4.  write schema validation tests in `test/broth/_message/*`.  This
    helps prevent some malicious payloads.
5.  write end-to-end tests in `test/broth/*`

6. (only v0.1.0) add a inbound translation and an outbound
   translation route to `Broth.Message.Translator.V0_1_0`
7. (only v0.1.0) write the appropriate test in either `test/broth/_calls` or `test/broth/_casts`

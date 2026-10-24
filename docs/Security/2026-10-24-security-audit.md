# DogeHouse Security Assessment

**Target:** `benawad/dogehouse` (public archive)
**Branch analysed:** `staging`
**Commit:** `584055ad407bc37fa35cdf36ebb271622e29d436` (2021-05-22)
**Comparison branch:** `origin/prod` at `8d2413913f6c7b0a8a1faa7f5affcea7bb4886b2` (2021-05-03)
**Assessment type:** Offline source-code security review (static analysis)
**Report date:** 2026-10-24

> **Scope and authorization.** This report is derived solely from the public archived source tree. No live DogeHouse service, staging deployment, user account, or third-party system was accessed or tested. All exploit outlines are protocol-level descriptions against synthetic accounts and must not be used against systems without explicit written authorization. The project is archived; this document is intended for defenders, historians, and engineers studying real-world authorization failures.

---

## Contents

1. [Executive Summary](#1-executive-summary)
2. [Scope, Method, and Evidence Standard](#2-scope-method-and-evidence-standard)
3. [System Model](#3-system-model)
4. [Attack Surface](#4-attack-surface)
5. [Findings](#5-findings) — F-01 through F-18
6. [Exploit Chains](#6-exploit-chains)
7. [Severity and Applicability Matrix](#7-severity-and-applicability-matrix)
8. [Remediation Roadmap](#8-remediation-roadmap)
9. [Detection and Monitoring](#9-detection-and-monitoring)
10. [Non-Findings and False Positives](#10-non-findings-and-false-positives)
11. [Appendices](#11-appendices)

---

## 1. Executive Summary

DogeHouse is a real-time voice/chat platform built as a monorepo: an Elixir/Cowboy WebSocket API (`kousa`), a Node/mediasoup SFU (`shawarma`), a Next.js web client (`kibbeh`), an Electron desktop client (`baklava`), and a shared client library (`kebab`). The most serious weaknesses are not memory-safety bugs or exotic injection flaws; they are **authorization-model failures** in which the server trusts the wrong identifier, the wrong room, or the client's claim of ownership.

### Overall risk

| Environment | Rating | Rationale |
|---|---|---|
| Production code path | **High** | Authenticated users can manipulate roles in arbitrary rooms, delete arbitrary room messages, and retain access after a platform ban. Desktop client turns any content injection on an allowed host into OS-level code execution. |
| Staging deployment (`IS_STAGING=true`) | **Critical** | An unauthenticated endpoint mints valid tokens for arbitrary usernames, and OAuth callbacks can be redirected to attacker-controlled origins with tokens in the query string. |
| Local/dev | **Critical (expected)** | The same token-minting route is enabled under `env == :dev`; this is acceptable only when isolated from real users and data. |

No unauthenticated production remote-code-execution path was confirmed. The production risk is therefore **High**, not Critical. The staging configuration is Critical because token minting is unauthenticated and CORS is globally permissive.

### Top findings

| ID | Finding | Severity | Production | Staging |
|---|---|---|---|---|
| F-01 | Cross-room authorization confusion in `room:set_auth` / `room:set_role`; any room creator can grant mod to an arbitrary user in another room, demote mods/speakers, and gain speaker in a target room | **High** | Yes (core); `set_owner` runtime-creator side effect staging-only | Yes |
| F-02 | Any room listener can delete arbitrary messages by supplying their own `userId` and a victim `messageId` | **High** | Yes | Yes |
| F-03 | Bans do not revoke sessions: existing WebSockets remain authenticated indefinitely; access tokens remain valid for up to one hour; `tokenVersion` is never incremented | **High** | Yes | Yes |
| F-04 | `/dev/test-info` mints tokens for arbitrary existing users without authentication; global `Access-Control-Allow-Origin: *` | **Critical (staging)** | No (returns 400 unless misconfigured) | Yes |
| F-05 | OAuth `redirect_after_base` on staging appends access/refresh tokens to an attacker-controlled URL; tokens also travel in query strings and persist in `localStorage` | **High (staging)** | No (ignored in prod) | Yes |
| F-06 | Login CSRF / session fixation: any URL with `accessToken`/`refreshToken` logs the victim into the attacker's account; OAuth `state` is predictable base64 JSON, not a random nonce | **Medium** | Yes | Yes |
| F-07 | "Private" rooms are unlisted, not access-controlled; `GET /user/:username` leaks `currentRoomId`; joining a private room grants a voice send transport | **Medium** | Yes | Yes |
| F-08 | Electron main/splash windows use `nodeIntegration: true` and `contextIsolation: false`; allowed-host navigation (including `localhost` and staging) stays in-app; `allowDowngrade = true` | **High (conditional)** | Desktop build | Desktop build |
| F-09 | Raw client-supplied `X-Forwarded-For` is trusted for identity/IP bans, enabling ban evasion and IP-based framing | **Medium** | Yes, if proxy does not sanitise header | Yes |
| F-10 | Production compose inherits published Postgres/RabbitMQ/Adminer ports | **Medium (deployment)** | Depends on firewall | Depends on firewall |
| F-11 | Whisper fan-out to an unbounded recipient list; one message can spam or load thousands of users | **Low–Medium** | Yes | Yes |
| F-12 | Unbounded chat-token array allows CPU/memory amplification per message | **Low** | Yes | Yes |
| F-13 | `UUID.normalize/1` corrupts uppercase hex (`char - 32` instead of `+ 32`) | **Low** | Yes | Yes |
| F-14 | `user:revoke_api_key` nil dereference; `test:operator` references a test-only module in the production manifest | **Low** | Yes | Yes |
| F-15 | Mod self-demotion writes `isMod: true` while broadcasting `isMod: false` | **Low** | Yes | Yes |
| F-16 | Dependency risk: Next.js 10.2.0 (17 OSV advisories), Electron 12.0.2 (55, EOL), electron-updater 4.3.8 (code-signing bypass), unused `ws`/`jsonwebtoken` advisories, `normalize-url` ReDoS | **Low / informational** | Version-confirmed; most exploit paths not demonstrated reachable | Same |
| F-17 | No CSP, `Referrer-Policy`, or other security headers; tokens in `localStorage` | **Low (defence-in-depth)** | Yes | Yes |
| F-18 | Push-to-talk release does not re-mute; microphone remains open until the next keydown | **Low (privacy)** | Desktop build | Desktop build |

### What matters most

1. **The room-authorization model is inverted.** `Kousa.Room.set_auth/3` and `set_role/3` resolve the room from the *target user's* `currentRoomId`, but authorise the caller using the *caller's own* room status. This lets a creator of any throwaway room act as an authority in any other room.
2. **Chat deletion trusts the client's ownership claim.** The server never loads the message or compares its author to the supplied `userId`. A listener can erase any message in their room.
3. **Bans are a UI event, not a server-side revocation.** The ban path sets `reasonForBan`, sends a `banned` operator, and removes the user from the room, but does not close the socket, invalidate the access token, or bump `tokenVersion`.
4. **Staging is a token-dispensing environment.** `/dev/test-info` plus wildcard CORS is a full account-takeover primitive for any known username. The OAuth redirect parameter is a second token-exfiltration path.
5. **The desktop client is one injection away from OS compromise.** Remote web content runs with Node integration and no context isolation, and navigation to `localhost` or staging hosts is deliberately allowed.

### Priority remediation

- **P0:** Fix cross-room role authorization; server-side message ownership checks; revoke sessions on ban; disable `/dev/test-info` everywhere except isolated local dev; remove `redirect_after_base`.
- **P1:** Harden OAuth state and token transport; enforce private-room access control; harden Electron (`nodeIntegration: false`, `contextIsolation: true`, deny navigation); stop trusting raw `X-Forwarded-For`.
- **P2:** Remove published management ports; cap whisper recipients and token counts; fix UUID/nil/self-demotion defects; upgrade EOL dependencies; add CSP/Referrer-Policy.

---

## 2. Scope, Method, and Evidence Standard

### 2.1 Scope

In scope:

- `kousa/` — Elixir API, WebSocket protocol, auth/token handling, room/chat/user operators, HTTP OAuth routes, data layer, CORS.
- `shawarma/` — Node/mediasoup voice SFU and RabbitMQ message handling.
- `kibbeh/` — Next.js web client: OAuth landing, token storage, chat rendering, link handling.
- `baklava/` — Electron desktop client: window creation, navigation, updater, keybinds, overlay.
- `pilaf/` — React Native client: deep-link token handling.
- `globalkey/` — native global-keyboard addon.
- Deployment files: `docker-compose.yml`, `docker-compose.prod.yml`, example env/config.

Out of scope:

- Live infrastructure, production databases, real user data, OAuth provider configuration, CDN/WAF rules.
- Dynamic exploitation, fuzzing, or traffic capture.
- Third-party services (GitHub, Discord, Twitter, Cloudflare, Google Cloud).
- Exhaustive review of every UI component or every dependency transitive path.

### 2.2 Method

1. **Repository archaeology.** Cloned the public repo, identified `staging` as the newest archived branch (2021-05-22) and compared security-sensitive logic with `origin/prod` (2021-05-03).
2. **Trust-boundary mapping.** Traced every path where a client-controlled value crosses into a privileged operation: WebSocket operator payloads, HTTP query/body parameters, OAuth `state`, `X-Forwarded-For`, chat message IDs, user IDs, room IDs.
3. **Authorization review.** For each operator, identified the actor, the resource, and the check. Compared the room/user used for the check with the room/user used for the write.
4. **Data-flow review.** Followed token issuance, storage, refresh, and revocation; followed chat message ownership from client to broadcast.
5. **Client review.** Inspected OAuth landing, token storage, link rendering, Electron `webPreferences`, navigation handlers, updater settings, and PTT logic.
6. **Dependency review.** Queried OSV for exact versions in `package.json`/lockfiles; assessed whether vulnerable features are used.
7. **Evidence grading.** Every finding is labelled **confirmed** (source path is clear), **conditional** (requires a configuration, user action, or deployment property), or **not reachable** (reviewed and ruled out).

### 2.3 Evidence standard

- **Confirmed:** The code path is present and the preconditions are ordinary for the deployment model.
- **Conditional:** The code path is present but requires a specific configuration (e.g., `IS_STAGING=true`), user interaction (e.g., clicking a link), or deployment property (e.g., host firewall exposing a port).
- **Not reachable:** The vulnerable code/version is present, but the application does not use the feature or validates away the attack input.
- **Severity** is qualitative, based on impact and preconditions. Numeric CVSS scores are deliberately omitted because deployment context (reverse proxy, WAF, room size, staff accounts) materially changes the score.

### 2.4 Limitations

- Static analysis cannot prove that a path is reachable in a particular deployment; database state, feature flags, and reverse-proxy behaviour matter.
- Line numbers refer to the analysed commit and may differ in other revisions.
- Dependency advisories are version-presence findings, not proof of exploitability; each is annotated with applicability.
- The frontend was reviewed for token handling and link navigation, not exhaustively for every DOM sink.
- No vendor was contacted; the project is archived. Findings should be treated as historical and educational.
- The report intentionally avoids live-target instructions and uses synthetic identifiers in all protocol examples.

---

## 3. System Model

### 3.1 Components

| Component | Stack | Role |
|---|---|---|
| `kousa` | Elixir, Plug/Cowboy, Ecto/PostgreSQL, Joken, Phoenix.PubSub, RabbitMQ | HTTP API, WebSocket gateway, auth, rooms, chat, moderation, scheduled rooms |
| `shawarma` | Node.js, mediasoup, RabbitMQ | Voice SFU: transports, producers, consumers, room peers |
| `kibbeh` | Next.js 10, React 17, Zustand, Tailwind | Web client, OAuth landing, chat UI, room UI |
| `baklava` | Electron 12, React, electron-updater, native `globalkey` | Desktop client, overlay, global keybinds, PTT |
| `kebab` | TypeScript | Shared client library / protocol types |
| `pilaf` | React Native | Mobile client, deep-link token handling |
| `dinner`, `dolma`, `kofta` | Supporting services/tools | Ancillary |

### 3.2 Trust boundaries

1. **Internet → `kousa` HTTP.** OAuth routes, `/dev/test-info`, `/room/:id`, `/user/:username`, `/scheduled-room`, `/bot/auth`, `/stats`.
2. **Internet → `kousa` WebSocket.** Authenticated operators for rooms, chat, users, voice signalling. The WebSocket is the primary privileged interface.
3. **`kousa` → PostgreSQL.** Ecto queries; room permissions, users, rooms, blocks, scheduled rooms.
4. **`kousa` → RabbitMQ → `shawarma`.** Voice commands (`join-as-speaker`, `join-as-new-peer`, `@send-track`, `@connect-transport`, `close-peer`, `destroy-room`). `kousa` rewrites `peerId`/`roomId` before forwarding.
5. **Browser → `kibbeh`.** Tokens in URL then `localStorage`; chat links; OAuth redirects.
6. **Electron main ↔ renderer.** `nodeIntegration`, IPC, native key listener, overlay.
7. **Deployment → host.** Published Postgres/RabbitMQ/Adminer ports; env-file secrets.

### 3.3 Attacker profiles

| Profile | Capability | Relevant findings |
|---|---|---|
| Unauthenticated internet user | Can call public HTTP routes, start OAuth, connect WebSocket without auth (limited) | F-04, F-05, F-06, F-07 |
| Authenticated low-privilege user | Can create a room (becoming creator), join rooms, send chat/whispers, raise hand | F-01, F-02, F-11, F-12 |
| Room creator | Full control of own room; can create throwaway rooms | F-01 (primary) |
| Room moderator | Kick/ban/delete in own room | F-01 (secondary), F-02 (mod clause), F-09 |
| Platform admin (`ben_github_id`) | `user:ban`, `user:admin_update` | F-03, F-04 (if impersonated) |
| Desktop victim | Runs Electron client, clicks chat links | F-08, F-18 |
| Malicious/compromised staging origin | Can serve content on allowed host | F-05, F-08 |

---

## 4. Attack Surface

### 4.1 HTTP routes

| Route | Auth | Notes |
|---|---|---|
| `GET /auth/github/web` | No | Builds OAuth `state`; staging accepts `redirect_after_base` |
| `GET /auth/github/callback` | No | Exchanges code; redirects with tokens in query |
| `GET /auth/discord/web`, `/callback` | No | Same pattern |
| `GET /auth/twitter/web`, `/callback` | No | Same pattern (not deeply reviewed) |
| `GET /dev/test-info?username=` | No | Token minting when `env == :dev` or `staging?` |
| `GET /room/:id` | No | Rejects private rooms; returns public room |
| `GET /user/:username` | No | Returns user encoder including `currentRoomId` |
| `GET /scheduled-room/...` | Mixed | Reviewed; edit is creator-scoped |
| `POST /bot/auth` | API key | Rate-limited (20 attempts/IP) |
| `GET /stats` | No | Metrics |
| `WS /socket` | Token in first auth message | Primary privileged interface |

### 4.2 WebSocket operators (high-risk subset)

`room:create`, `room:join`, `room:leave`, `room:update`, `room:set_auth`, `room:set_role`, `room:ban`, `room:unban`, `room:invite`, `chat:send`, `chat:delete`, `chat:ban`, `chat:unban`, `user:ban`, `user:admin_update`, `user:revoke_api_key`, `user:create_bot`, `room:update_scheduled`, `room:delete_scheduled`, `test:operator`.

Notable protocol properties:

- `Broth.Message.Cast` defaults `needs_auth: true`; most operators require an authenticated socket.
- Inbound messages can use `d` or legacy `p`; the server translates.
- Mediasoup messages are special-cased: any operator beginning with `@` is forwarded to the voice server after `peerId`/`roomId` are overwritten with the authenticated user's values.
- The chat process is per-room and single-threaded; fan-out and deletion are serialised through it.

### 4.3 Voice path

`Kousa.Room.join_vc_room/3` chooses `join-as-speaker` when the user is creator, has `isSpeaker`, or the room is private; otherwise `join-as-new-peer`. `shawarma` creates a send transport only for `join-as-speaker`. `@send-track` requires `state[peerId].sendTransport`; listeners do not have one. `Kousa.Broth.SocketHandler.dispatch_mediasoup_message/2` overwrites client-supplied `peerId` and `roomId` with the authenticated user's current room, preventing cross-room voice injection.

### 4.4 Desktop/mobile

- Electron main window loads `https://dogehouse.tv/` in production with Node integration.
- Allowed hosts include `localhost`, `staging.dogehouse.tv`, and `doge-staging.stripcode.dev`.
- `pilaf` accepts `dogehouse://` deep links containing tokens and stores them in unencrypted AsyncStorage.
- Global key listener polls all keyboard keys for PTT.

### 4.5 Deployment

- Base compose publishes Postgres `5432`, RabbitMQ `5672/15672`, Adminer `8080`.
- Production override supplies images/env files but does not remove those port mappings.
- Secrets are read from environment variables in `releases.exs`; no production secrets were found in the repository.

---

## 5. Findings

### F-01 — Cross-room authorization confusion in room role management

**Severity:** High
**Confidence:** Confirmed (source)
**CWE:** CWE-863 (Incorrect Authorization), CWE-639 (Authorization Bypass Through User-Controlled Key)
**Affected:** `staging`; core logic also present in `origin/prod`. `set_owner` runtime-creator side effect is staging-only.
**Location:**
- `kousa/lib/kousa/room.ex:127-143` (`set_auth/3`)
- `kousa/lib/kousa/room.ex:148-161` (`set_owner/3`)
- `kousa/lib/kousa/room.ex:167-186` (`set_mod/3`)
- `kousa/lib/kousa/room.ex:211-227` (`set_user/3`, creator path)
- `kousa/lib/kousa/room.ex:239-305` (`set_role/3`, listener/speaker paths)
- `kousa/lib/beef/access/rooms.ex:16-34` (`get_room_status/1`)
- `kousa/lib/beef/mutations/rooms.ex:115-125` (`replace_room_owner/2`)
- `kousa/lib/broth/message/room/set_auth.ex:12-22`
- `kousa/lib/broth/message/room/set_role.ex:17-28`

#### Summary

The server resolves the target room from the **target user's** `currentRoomId`, but authorises the actor using the actor's status in the **actor's own** room. The two rooms are never compared. A creator of any room can therefore change roles in any other room.

#### Evidence

```elixir
# kousa/lib/kousa/room.ex:127-143
def set_auth(user_id, auth, opts) do
  room_id = Beef.Users.get_current_room_id(user_id)   # target's room

  case auth do
    _ when is_nil(room_id) -> :noop
    :owner -> set_owner(room_id, user_id, opts[:by])
    :mod   -> set_mod(room_id, user_id, opts[:by])
    :user  -> set_user(room_id, user_id, opts[:by])
  end
end
```

```elixir
# kousa/lib/kousa/room.ex:167-186
defp set_mod(room_id, user_id, setter_id) do
  case Rooms.get_room_status(setter_id) do   # setter's own room
    {:creator, _} ->
      RoomPermissions.set_is_mod(user_id, room_id, true)  # target's room
      Onion.Chat.set_can_chat(room_id, user_id)
      Onion.RoomSession.broadcast_ws(room_id, %{
        op: "mod_changed",
        d: %{roomId: room_id, userId: user_id, isMod: true}
      })
    _ -> :noop
  end
end
```

`Rooms.get_room_status/1` is explicitly scoped to the user's current room:

```elixir
# kousa/lib/beef/access/rooms.ex:16-34
def get_room_status(user_id) do
  room = Users.get_current_room(user_id)
  cond do
    is_nil(room) -> {nil, nil}
    room.creatorId == user_id -> {:creator, room}
    true -> {case RoomPermissions.get(user_id, room.id) do
      %{isMod: true} -> :mod
      %{isSpeaker: true} -> :speaker
      %{askedToSpeak: true} -> :askedToSpeak
      _ -> :listener
    end, room}
  end
end
```

The client supplies an arbitrary target `userId`:

```elixir
# kousa/lib/broth/message/room/set_auth.ex:19-23
def execute(changeset, state) do
  with {:ok, %{userId: user_id, level: level}} <- apply_action(changeset, :validate) do
    Kousa.Room.set_auth(user_id, level, by: state.user.id)
    {:noreply, state}
  end
end
```

#### Sub-issues

1. **Cross-room mod grant.** A creator of room A can send `room:set_auth` with `userId` of a colluding account in room B and `level: "mod"`. `set_mod` checks the attacker is creator of A, then writes `isMod: true` for the target in B.
2. **Cross-room mod demotion.** A creator of A can send `level: "user"` for any mod in B; `set_user/3` checks the attacker is creator and sets `isMod: false` in B.
3. **Cross-room speaker/listener changes.** `set_role/3` resolves the target's room and checks the actor's own room. A creator can demote any non-creator in B to listener (removing their speaker/voice state), or promote a target who has asked to speak. A mod in A can do the same to non-creator/non-mod targets in B.
4. **`set_owner` cross-room side effects.** `set_owner(room_id, user_id, setter_id)` receives `room_id` = target's room, but calls `Rooms.replace_room_owner(setter_id, user_id)`, which updates the room where `creatorId == setter_id` (the attacker's own room; the `with` pattern requires exactly one updated row), not the target room. It then:
   - on `staging`, calls `Onion.RoomSession.set_room_creator_id(room_id, user_id)`, making the target the runtime creator/chat-eligible user in their own room;
   - calls `internal_set_speaker(setter_id, room_id)`, granting the attacker speaker status in the target room;
   - broadcasts `new_room_creator` in the target room with the target's ID, even though the database `creatorId` may be unchanged.
   `origin/prod` lacks the runtime-creator call but still performs the ownership transfer and speaker grant.
5. **`set_role` malformed-field bug.** `set_role.ex:22` calls `UUID.normalize(:id)` instead of `:userId`, so the target ID is not normalised. This is a robustness bug, not the core authorization flaw.

#### Preconditions

- Attacker is authenticated and is creator of a room they currently occupy. Any user can create a room (`room:create`), so this is effectively "any authenticated user".
- Target user is currently in a room.
- For full room takeover, the attacker needs a second account or bot in the target room to receive mod. A single attacker can demote mods/speakers, grant mod to arbitrary users, and gain speaker in the target room, but cannot directly make themselves mod in the target room because `set_auth` resolves the attacker's own current room.

#### Impact

- **Integrity/availability of arbitrary rooms.** With a second account, full moderation takeover: kick/ban users, IP-ban, delete messages, mute speakers.
- **Harassment/abuse enablement.** Grant mod to a malicious account in a victim room.
- **Voice disruption.** Demote speakers to listeners, removing their send transport (`remove-speaker`), or promote unapproved users.
- **State confusion.** Spoofed `new_room_creator` events and runtime creator state can mislead clients and users.
- **No victim interaction** beyond the colluding account joining the target room (public or private-by-ID).

#### PoC outline (synthetic, not executed)

1. Attacker `A` creates room `RA` and remains in it as creator.
2. Alt/bot `B` joins target room `RB`.
3. `A` sends over WebSocket:

```json
{"op":"room:set_auth","d":{"userId":"<B_UUID>","level":"mod"}}
```

4. Server resolves `room_id = RB` (B's current room), checks `A` is creator of `RA`, writes `B` as mod in `RB`, broadcasts `mod_changed` to `RB`.
5. `B` sends `room:ban` for victims in `RB`, or `chat:delete` for messages. `B` can also `room:set_role` to mute speakers.
6. `A` can demote `RB`'s existing mods with `level:"user"`, and demote speakers with `room:set_role`/`listener`.

#### Remediation

- Pass the target room explicitly and require `caller_room_id == target_room_id`.
- Verify the caller's role **in that room**, not in the caller's current room.
- For `set_owner`, update only the room being managed (`replace_room_owner(room_id, user_id)`), not all rooms by `creatorId`.
- Do not allow cross-room role changes; require the target to be in the caller's room and the caller to have authority there.
- Add authorization tests for cross-room `set_auth`, `set_role`, `set_owner`, `set_mod`, `set_user` attempts.
- Make `set_role` normalise `:userId` and reject malformed IDs.

#### Detection

- Alert when `actor.currentRoomId != target.currentRoomId` for `room:set_auth`/`room:set_role`.
- Alert on `mod_changed`/`new_room_creator` events initiated by a user who is not the room's DB creator.
- Alert on bursts of role changes across many rooms by one account.

---

### F-02 — Any listener can delete arbitrary room messages

**Severity:** High
**Confidence:** Confirmed (source)
**CWE:** CWE-639 (Authorization Bypass Through User-Controlled Key), CWE-862 (Missing Authorization)
**Affected:** `staging` and `origin/prod`
**Location:**
- `kousa/lib/kousa/chat.ex:51-79`
- `kousa/lib/onion/chat.ex:321-333`
- `kousa/lib/broth/message/chat/delete.ex:9-13, 25-35`
- `kousa/lib/broth/message/manifest.ex:47`

#### Summary

The deletion handler trusts the client-supplied `userId` as the message owner. It never loads the message or compares the message author to that ID. A listener can pass their own `userId` and any `messageId` in the room; the server authorises the deletion and broadcasts it.

#### Evidence

```elixir
# kousa/lib/kousa/chat.ex:54-79
def delete_msg(deletion, opts) do
  user_id = opts[:by]

  room =
    case Rooms.get_room_status(user_id) do
      {:creator, room} -> room
      # Mods cannot delete creator's messages
      {:mod, room = %{creatorId: creator_id}} when user_id != creator_id -> room
      {:listener, room} when user_id == deletion.userId -> room
      _ -> nil
    end

  if room do
    Onion.Chat.delete_message(room.id, deletion)
  else
    {:error, "#{user_id} not authorized to delete the selected message"}
  end
end
```

The comment in the message schema admits the trust boundary:

```elixir
# kousa/lib/broth/message/chat/delete.ex:9-13
# NB: the userId is the owner of the message. This may not necessarily be
# the PID of the websocket, since a mod or owner of a room should be able
# to delete other people's messages. It's the responsibility of the FE
# to make sure both the messageId and the userId match up correctly, or
# else deletion authority could be spoofed.
```

The server broadcasts the deletion without checking the message:

```elixir
# kousa/lib/onion/chat.ex:326-333
defp delete_message_impl(deletion, state) do
  PubSub.broadcast("chat:" <> state.room_id, %Broth.Message{
    operator: "chat:delete",
    payload: deletion
  })
  {:noreply, state}
end
```

#### Why it works

- `deletion.userId` is fully client-controlled.
- The listener clause only checks `user_id == deletion.userId` (caller equals the claimed owner), not `message.from == deletion.userId`.
- `messageId` is never resolved against a message store or room.
- The mod clause `when user_id != creator_id` checks the caller is not the creator, not that the message author is not the creator; mods can therefore delete creator messages despite the comment.
- No deletion throttle is applied.

#### Impact

- A listener can erase any live message in their room, including moderator announcements, evidence of abuse, or other users' content.
- Because joining a room is unrestricted (including private-by-ID), an attacker can join a target room and wipe messages in real time.
- Combined with F-01, a mod in a target room can delete the creator's messages.
- Integrity/harassment/evidence-destruction impact; no confidentiality impact.

#### PoC outline (synthetic)

1. Attacker joins room `R` as a listener.
2. Attacker observes a message with ID `M` (the client receives message IDs in `chat:send` payloads).
3. Attacker sends:

```json
{"op":"chat:delete","d":{"messageId":"<M_UUID>","userId":"<ATTACKER_UUID>"}}
```

4. Server resolves `R` from the attacker's current room, matches `{:listener, room} when user_id == deletion.userId`, and broadcasts `chat:delete` to all clients in `R`.
5. The message disappears for every client. Repeat for each message ID.

#### Remediation

- Store message metadata (author, room, timestamp) server-side.
- On delete, load the message by ID, verify `message.roomId == room.id`, and allow only:
  - the author (`message.from == user_id`), or
  - a creator/mod of that room, with an explicit policy for creator-authored messages.
- Ignore or cross-check the client-supplied `userId`; do not treat it as authoritative.
- Add a deletion rate limit and audit log.
- Fix the mod/creator guard to compare the **message author** to the creator, not the caller.

#### Detection

- Log deletions where `deleterId != message.authorId`; alert on bursts from one user.
- Alert on listeners issuing many `chat:delete` operations.
- Retain deletion audit records for moderation.

---

### F-03 — Bans do not revoke sessions; banned users persist

**Severity:** High
**Confidence:** Confirmed (source)
**CWE:** CWE-613 (Insufficient Session Expiration), CWE-287 (Improper Authentication)
**Affected:** `staging` and `origin/prod`
**Location:**
- `kousa/lib/kousa/utils/token_utils.ex:26-35, 38-55, 57-65`
- `kousa/lib/kousa/auth.ex:8-19, 22-45`
- `kousa/lib/kousa/user.ex:65-77`
- `kousa/lib/kousa/access_token.ex:7-8`
- `kousa/lib/kousa/refresh_token.ex:7-8`
- `kibbeh/src/shared-hooks/useMainWsHandler.tsx:139-145`

#### Summary

A platform ban sets `reasonForBan` and sends a `banned` WebSocket event, but it does not close the socket, invalidate the access token, or increment `tokenVersion`. Access tokens are accepted on signature alone. An existing WebSocket remains authenticated indefinitely; new connections are possible until the access token expires (up to one hour). The official client closes the socket on `banned`, but a custom client can ignore it.

#### Evidence

Access token verification returns the claim without a DB ban check:

```elixir
# kousa/lib/kousa/utils/token_utils.ex:26-35
def tokens_to_user_id(access_token!, refresh_token) do
  access_token! = access_token! || ""

  case Kousa.AccessToken.verify_and_validate(access_token!) do
    {:ok, claims} -> {:existing_claim, claims["userId"]}
    _ -> verify_refresh_token(refresh_token)
  end
end
```

`do_auth` does not check `reasonForBan` for the existing-claim path:

```elixir
# kousa/lib/kousa/auth.ex:8-19, 22-45
def authenticate(request, ip) do
  case TokenUtils.tokens_to_user_id(request.accessToken, request.refreshToken) do
    nil -> {:error, "invalid_authentication"}
    {:existing_claim, user_id} -> do_auth(Beef.Users.get(user_id), nil, request, ip)
    {:new_tokens, _user_id, tokens, user} -> do_auth(user, tokens, request, ip)
  end
end

defp do_auth(user, tokens, request, ip) do
  if user do
    # ... start session, set IP, set active WS ...
  else
    {:close, 4001, "invalid_authentication"}
  end
end
```

The ban path sets the flag and sends an event, but does not close or revoke:

```elixir
# kousa/lib/kousa/user.ex:65-77
def ban(user_id_to_ban, reason_for_ban, opts) do
  authorized_github_id = Application.get_env(:kousa, :ben_github_id, "")

  with %{githubId: ^authorized_github_id} <- Users.get_by_id(opts[:admin_id]),
       user_to_ban = %{} <- Users.get_by_id(user_id_to_ban) do
    Kousa.Room.leave_room(user_id_to_ban, user_to_ban.currentRoomId)
    Users.set_reason_for_ban(user_id_to_ban, reason_for_ban)
    Onion.UserSession.send_ws(user_id_to_ban, nil, %{op: "banned", d: %{}})
    :ok
  else
    _ -> {:error, "tried to ban #{user_id_to_ban} but that user didn't exist"}
  end
end
```

The client's response is purely local:

```tsx
// kibbeh/src/shared-hooks/useMainWsHandler.tsx:139-145
conn.addListener<any>("banned", () => {
  showErrorToast("you got banned");
  conn.close();
  useTokenStore.getState().setTokens({ accessToken: "", refreshToken: "" });
}),
```

Token lifetimes:

```elixir
# kousa/lib/kousa/access_token.ex:7-8
# 1 hour
def token_config, do: default_claims(default_exp: 60 * 60)

# kousa/lib/kousa/refresh_token.ex:7-8
# 30 days
def token_config, do: default_claims(default_exp: 60 * 60 * 24 * 30)
```

`tokenVersion` is only checked on refresh and is never incremented anywhere in the backend:

```elixir
# kousa/lib/kousa/utils/token_utils.ex:46-49
if user &&
     !user.reasonForBan &&
     user.tokenVersion == refreshClaims["tokenVersion"] do
  {:new_tokens, user.id, create_tokens(user), user}
end
```

#### Why it works

- Existing WebSocket: `state.user` is already populated; the ban does not terminate the process or clear it. The user can continue sending operators. `leave_room` removes them from the room, but `room:join` has no platform-ban check, so they can rejoin.
- New WebSocket: the access token is validated by signature/expiry only. `do_auth` does not check `reasonForBan`. Until the token expires, a banned user can reconnect.
- Refresh token: the refresh path does check `reasonForBan`, so after the access token expires the attacker cannot refresh. But they can hold multiple pre-ban access tokens, each valid for up to one hour from issuance.
- No server-side logout/revocation: clearing `localStorage` is client-side only.

#### Impact

- Ban evasion and continued harassment for the lifetime of the socket (indefinitely) or access token (up to one hour for reconnects).
- A banned user can rejoin public/private-by-ID rooms and continue chatting, speaking (if permissions), or deleting messages.
- Moderation controls are advisory to the official client, not enforced by the server.

#### PoC outline (synthetic)

1. Attacker authenticates and opens a WebSocket; `state.user` is set.
2. Admin bans the attacker. Server sets `reasonForBan`, leaves the room, sends `{"op":"banned"}`.
3. A custom client ignores `banned`, sends `room:join` for a room, and continues sending `chat:send`/`chat:delete`.
4. If disconnected, the attacker reconnects with the same access token within one hour; `tokens_to_user_id` accepts it without a ban check.

#### Remediation

- On ban, increment `tokenVersion` and close all active WebSockets for the user (`UserSession` should support a close/kill).
- Check `reasonForBan` on **every** authentication path, including existing access-token claims.
- Add a server-side revocation list or short-lived access tokens with refresh rotation.
- Add a real logout endpoint that revokes refresh tokens and bumps `tokenVersion`.
- Re-check ban status on privileged operators, not just at connection time.
- Consider device/session tracking and explicit “sign out all sessions”.

#### Detection

- Alert when a user with `reasonForBan` opens a WebSocket or sends operators.
- Alert on `banned` events followed by continued activity from the same user ID.
- Track access-token use after ban timestamp.

---

### F-04 — Staging `/dev/test-info` mints tokens for arbitrary users

**Severity:** Critical in staging/dev; not production by default
**Confidence:** Confirmed (source); conditional on `IS_STAGING=true` or `env == :dev`
**CWE:** CWE-306 (Missing Authentication for Critical Function), CWE-489 (Active Debug Code)
**Affected:** `staging` and any deployment with `IS_STAGING=true`; local dev.
**Location:**
- `kousa/lib/broth/routes/dev_only.ex:11-51`
- `kousa/lib/broth.ex:39, 48-52`
- `kousa/lib/broth/plugs/cors.ex:7-15`
- `kousa/config/releases.exs:70`

#### Summary

`GET /dev/test-info?username=<name>` returns valid access and refresh tokens for an existing user, or creates a user with that username and returns tokens. There is no authentication, no authorization, and no origin restriction. CORS is globally `*`. On a public staging deployment, this is full account takeover for any known username, including staff.

#### Evidence

```elixir
# kousa/lib/broth/routes/dev_only.ex:11-51
get "/test-info" do
  env = Application.fetch_env!(:kousa, :env)
  staging? = Application.get_env(:kousa, :staging?)

  if env == :dev || staging? do
    username = fetch_query_params(conn).query_params["username"]
    user = Beef.Users.get_by_username(username)

    conn
    |> put_resp_content_type("application/json")
    |> send_resp(200, Jason.encode!(
      Kousa.Utils.TokenUtils.create_tokens(
        if(is_nil(user),
          do: Beef.Repo.insert!(%User{username: username, ...}),
          else: user
        )
      )
    ))
  else
    conn |> put_resp_content_type("application/json") |> send_resp(400, Jason.encode!(%{"error" => "no"}))
  end
end
```

```elixir
# kousa/config/releases.exs:70
staging?: System.get_env("IS_STAGING") == "true",
```

```elixir
# kousa/lib/broth.ex:38-39, 48-52
use Sentry.PlugCapture
plug(Broth.Plugs.Cors)
...
forward("/dev", to: DevOnly)
```

```elixir
# kousa/lib/broth/plugs/cors.ex:7-15
def call(conn, _opts) do
  conn
  |> put_resp_header("Access-Control-Allow-Origin", "*")
  |> put_resp_header("Access-Control-Allow-Method", "POST, GET, OPTIONS")
  |> put_resp_header("Access-Control-Max-Age", "86400")
  |> put_resp_header("Access-Control-Allow-Headers", "Origin, X-Access-Token, X-Refresh-Token, Content-Type, Accept")
end
```

#### Why it works

- No auth plug on the route.
- `staging?` is a runtime environment flag, commonly true on the public staging deployment.
- The route returns tokens for an existing user, not a fresh test-only account.
- CORS `*` lets any website read the JSON response from a browser, not just a direct HTTP client.
- The route can also create users, but the higher-impact case is impersonating existing staff/users.

#### Impact

- Impersonate any staging user, including moderators/admins, by username.
- If the staging database shares identities or data with production (or if the flag is misconfigured in production), this becomes production account takeover.
- Bypass OAuth entirely; no GitHub/Discord interaction needed.
- Combined with F-01/F-02/F-03, full room/platform abuse under a trusted identity.

#### PoC outline (synthetic, staging only)

1. Request `GET https://<staging-api>/dev/test-info?username=<known-staff-username>`.
2. Read `{accessToken, refreshToken}` from the JSON response.
3. Authenticate a WebSocket with those tokens; the socket is now that user.
4. If the user is Ben (`BEN_GITHUB_ID`), `user:ban` and `user:admin_update` become available; other staff can use `user:admin_update`.

#### Remediation

- Remove `/dev/test-info` from the production/staging router entirely; compile it only in `MIX_ENV=dev` and never deploy that build.
- Require an admin secret + network allowlist if a test helper is absolutely needed.
- Never return production-equivalent tokens from an unauthenticated route.
- Restrict CORS to explicit origins; do not use `*` on token-returning endpoints.
- Rotate staging secrets and invalidate all staging sessions if the deployment was public.

#### Detection

- Alert on any request to `/dev/test-info` in non-dev environments.
- Alert on token issuance without an OAuth/bot-auth event.
- Monitor for multiple usernames requested from one IP/origin.

---

### F-05 — OAuth token leakage via `redirect_after_base` on staging

**Severity:** High in staging; not production by default
**Confidence:** Confirmed (source); conditional on `IS_STAGING=true`
**CWE:** CWE-601 (URL Redirection to Untrusted Site), CWE-598 (Use of GET Request Method With Sensitive Query Strings)
**Affected:** Staging; both GitHub and Discord.
**Location:**
- `kousa/lib/broth/routes/github_auth.ex:12-38, 50-72, 119-130`
- `kousa/lib/broth/routes/discord_auth.ex:10-20, 44-55, 99-110`
- `kousa/lib/broth/plugs/redirect.ex:4-11`

#### Summary

On staging, `/auth/github/web` and `/auth/discord/web` accept a `redirect_after_base` query parameter and embed it in the OAuth `state`. After a successful login, the callback redirects to that URL with `accessToken` and `refreshToken` appended as query parameters. An attacker can send a victim a link to the legitimate staging API with `redirect_after_base=https://attacker.example`; after the victim authenticates, the tokens are sent to the attacker.

#### Evidence

```elixir
# kousa/lib/broth/routes/github_auth.ex:18-28
state =
  %{
    redirect_base_url:
      if(Application.get_env(:kousa, :staging?),
        do: fetch_query_params(conn).query_params["redirect_after_base"],
        else: "web"
      ),
    redirect_to_next: redirect_to_next
  }
  |> Jason.encode!()
  |> Base.encode64()
```

```elixir
# kousa/lib/broth/routes/github_auth.ex:50-72
def get_base_url(conn) do
  with state <- Map.get(conn.query_params, "state", ""),
       {:ok, json} <- Base.decode64(state),
       {:ok, %{"redirect_base_url" => redirect_base_url, "redirect_to_next" => redirect_to_next}}
         when is_binary(redirect_base_url) <- Jason.decode(json) do
    cond do
      redirect_to_next -> "https://next.dogehouse.tv"
      Application.get_env(:kousa, :staging?) -> redirect_base_url
      true -> Application.fetch_env!(:kousa, :web_url)
    end
  else
    _ -> Application.fetch_env!(:kousa, :web_url)
  end
end
```

```elixir
# kousa/lib/broth/routes/github_auth.ex:119-130
conn
|> Broth.Plugs.Redirect.redirect(
  get_base_url(conn) <>
    "/?accessToken=" <>
    Kousa.AccessToken.generate_and_sign!(%{"userId" => db_user.id}) <>
    "&refreshToken=" <>
    Kousa.RefreshToken.generate_and_sign!(%{
      "userId" => db_user.id,
      "tokenVersion" => db_user.tokenVersion
    })
)
```

Discord follows the same pattern:

```elixir
# kousa/lib/broth/routes/discord_auth.ex:10-20, 44-55, 99-110
state =
  if Application.get_env(:kousa, :staging?) do
    %{redirect_base_url: fetch_query_params(conn).query_params["redirect_after_base"]}
    |> Jason.encode!() |> Base.encode64()
  else
    "web"
  end
...
get_base_url(conn) ...
redirect(get_base_url(conn) <> "/?accessToken=" <> ...)
```

#### Why it works

- `redirect_after_base` is attacker-controlled and not validated against an allowlist.
- The OAuth `state` is base64 JSON, not signed and not bound to a browser cookie; the callback trusts it.
- Tokens are placed in the query string, so the destination origin receives them in the request line, Referer, and server logs.
- On production, `get_base_url` ignores `redirect_base_url` and uses `web_url`; the issue is staging-specific by code. If `IS_STAGING` is misconfigured in a production deployment, it becomes production-critical.

#### Impact

- Full account takeover of any user who completes the phishing flow on staging.
- Tokens in attacker-controlled URL and logs.
- If the victim is staff/admin, the attacker inherits those privileges (subject to `BEN_GITHUB_ID` restrictions for the most sensitive actions).

#### PoC outline (synthetic, staging only)

1. Attacker sends victim: `https://<staging-api>/auth/github/web?redirect_after_base=https://attacker.example`.
2. Victim authenticates with GitHub.
3. Callback redirects to `https://attacker.example/?accessToken=...&refreshToken=...`.
4. Attacker records the tokens and authenticates as the victim.

#### Remediation

- Remove `redirect_after_base` entirely; use a server-side allowlist of redirect URIs.
- Generate a cryptographically random `state`, store it in an HttpOnly/SameSite cookie, and verify it on callback.
- Deliver tokens via a one-time code exchanged server-to-server, or set HttpOnly/Secure/SameSite cookies.
- Never put access/refresh tokens in query strings.
- Set `Referrer-Policy: no-referrer` on OAuth routes.
- Rotate secrets and revoke sessions if staging was exposed.

#### Detection

- Alert on OAuth callbacks whose `redirect_base_url` is not an allowlisted origin.
- Alert on token issuance followed by immediate use from a different ASN/IP.
- Monitor staging access logs for `/dev/test-info` and unusual OAuth redirects.

---

### F-06 — Login CSRF / session fixation via URL tokens and predictable OAuth state

**Severity:** Medium
**Confidence:** Confirmed (source)
**CWE:** CWE-352 (Cross-Site Request Forgery), CWE-384 (Session Fixation)
**Affected:** `staging` and `origin/prod` (client-side token import); OAuth state issue both.
**Location:**
- `kibbeh/src/modules/auth/useSaveTokensFromQueryParams.ts:10-35`
- `kibbeh/src/modules/auth/useTokenStore.ts:5-6, 24-34`
- `kousa/lib/broth/routes/github_auth.ex:18-30`
- `kousa/lib/broth/routes/discord_auth.ex:10-20`
- `kibbeh/next.config.js:1-16`

#### Summary

The web client accepts `accessToken` and `refreshToken` from **any** URL query string and stores them in `localStorage`. An attacker can send a victim `https://dogehouse.tv/?accessToken=<attacker>&refreshToken=<attacker>`; the victim is silently logged into the attacker's account. The OAuth `state` is predictable base64 JSON rather than a random, cookie-bound nonce, so OAuth login CSRF is also feasible if an attacker can capture a callback code.

#### Evidence

```ts
// kibbeh/src/modules/auth/useSaveTokensFromQueryParams.ts:14-34
if (
  typeof params.accessToken === "string" &&
  typeof params.refreshToken === "string" &&
  params.accessToken &&
  params.refreshToken
) {
  useTokenStore.getState().setTokens({
    accessToken: params.accessToken,
    refreshToken: params.refreshToken,
  });
  let nextPath = "/dash";
  // ... localStorage next path ...
  setTimeout(() => push(nextPath), 100);
}
```

```ts
// kibbeh/src/modules/auth/useTokenStore.ts:5-6, 26-30
const accessTokenKey = "@toum/token";
const refreshTokenKey = "@toum/refresh-token";
...
localStorage.setItem(accessTokenKey, x.accessToken);
localStorage.setItem(refreshTokenKey, x.refreshToken);
```

The URL is not cleaned before the redirect; tokens remain in browser history and can be captured by client-side logging or extensions.

#### Why it works

- No validation that the tokens came from an OAuth callback, no one-time nonce, no `state` check on the client.
- Any page load with the parameters imports them.
- The OAuth `state` is not random and not tied to the user's session; the callback accepts a base64 JSON blob.
- Tokens are long-lived (1h access, 30d refresh) and stored in `localStorage`, readable by any same-origin script.

#### Impact

- Victim’s actions, messages, room joins, and profile changes are attributed to the attacker's account (or vice versa), enabling social engineering, reputation manipulation, and confusion.
- If the victim is tricked into entering private information while logged into the attacker's account, the attacker can read it.
- OAuth login CSRF can bind a victim's browser to an attacker-controlled identity.
- Tokens in URL/history/logs increase exposure.

#### PoC outline (synthetic)

1. Attacker creates an account and obtains its tokens.
2. Sends victim `https://dogehouse.tv/?accessToken=<attacker>&refreshToken=<attacker>`.
3. Victim's client stores the tokens and navigates to `/dash`; all actions occur in the attacker's account.
4. Attacker monitors the account for content the victim posts or information they enter.

#### Remediation

- Do not accept tokens from arbitrary query strings. Use a one-time authorization code exchanged by the backend, or HttpOnly/SameSite cookies.
- If query tokens are unavoidable, require a signed, short-lived, single-use nonce bound to the OAuth state and strip the query with `history.replaceState` immediately.
- Generate random OAuth `state` and bind it to an HttpOnly cookie; verify on callback.
- Store tokens in HttpOnly/Secure/SameSite cookies rather than `localStorage`.
- Add `Referrer-Policy: no-referrer` and a strict CSP.
- Invalidate tokens after first use where possible.

#### Detection

- Alert on page loads with `accessToken`/`refreshToken` query parameters that do not correspond to a recent OAuth callback.
- Monitor for the same token pair used from multiple IPs/user agents.
- Alert on rapid account switching.

---

### F-07 — “Private” rooms are unlisted, not access-controlled

**Severity:** Medium (privacy/expectation mismatch)
**Confidence:** Confirmed (source)
**CWE:** CWE-284 (Improper Access Control), CWE-200 (Exposure of Sensitive Information)
**Affected:** `staging` and `origin/prod`
**Location:**
- `kousa/lib/kousa/room.ex:482-531`
- `kousa/lib/beef/access/rooms.ex:36-60`
- `kousa/lib/broth/routes/user.ex:12-20`
- `kousa/lib/beef/schemas/user.ex:162-179`
- `kousa/lib/broth/routes/room.ex:29-35`

#### Summary

Private rooms are explicitly implemented as “unlisted”: anyone who knows the room ID can join. The public `GET /user/:username` endpoint returns the user's `currentRoomId` without authentication, so a private room ID can be discovered from a username. Joining a private room also grants a voice send transport (`canSpeak || room.isPrivate`), so the joiner can speak, not just listen.

#### Evidence

```elixir
# kousa/lib/kousa/room.ex:482-525
def join_room(user_id, room_id) do
  currentRoomId = Beef.Users.get_current_room_id(user_id)

  if currentRoomId == room_id do
    %{room: Rooms.get_room_by_id(room_id)}
  else
    case Rooms.can_join_room(room_id, user_id) do
      {:error, message} -> %{error: message}
      {:ok, room} ->
        # private rooms can now be joined by anyone who has the link
        # they are functioning closer to an "unlisted" room
        if currentRoomId do
          leave_room(user_id, currentRoomId)
        end
        PubSub.subscribe("chat:" <> room_id)
        updated_user = Rooms.join_room(room, user_id)
        # ...
        join_vc_room(user_id, room, canSpeak || room.isPrivate)
        %{room: room}
    end
  end
end
```

`can_join_room/2` has no `isPrivate` check:

```elixir
# kousa/lib/beef/access/rooms.ex:36-60
def can_join_room(room_id, user_id) do
  room = get_room_by_id(room_id)
  max_room_size = Application.fetch_env!(:kousa, :max_room_size)

  case room do
    nil -> {:error, "room doesn't exist anymore"}
    _ ->
      cond do
        room.numPeopleInside >= max_room_size -> {:error, "room is full"}
        RoomBlocks.blocked?(room_id, user_id) -> {:error, "you are blocked from the room"}
        true ->
          if UserBlocks.blocked?(room.creatorId, user_id) do
            {:error, "the creator of the room blocked you"}
          else
            {:ok, room}
          end
      end
  end
end
```

The user route is unauthenticated and returns the full user encoder:

```elixir
# kousa/lib/broth/routes/user.ex:12-20
get "/:username" do
  %Plug.Conn{params: %{"username" => username}} = conn
  conn
  |> put_resp_content_type("application/json")
  |> send_resp(200, Jason.encode!(%{user: Users.get_by_username(username)}))
end
```

```elixir
# kousa/lib/beef/schemas/user.ex:162-179
defimpl Jason.Encoder do
  @fields ~w(id whisperPrivacySetting username avatarUrl bannerUrl bio online contributions staff
lastOnline currentRoomId currentRoom displayName numFollowing numFollowers
youAreFollowing followsYou botOwnerId roomPermissions iBlockedThem)a
  # ...
end
```

#### Why it works

- `join_room` comments acknowledge the design: private means “unlisted”.
- `GET /user/:username` returns `currentRoomId` for any user, no auth.
- The direct `GET /room/:id` route rejects private rooms (`room.ex:29-35`), so the ID leak from `/user/:username` bypasses that protection.
- `join_vc_room(..., canSpeak || room.isPrivate)` grants a send transport to any joiner of a private room.

#### Impact

- A private room's expectation of access control is violated: anyone who can identify an online user's username can discover and join their private room.
- The joiner can read/send chat, delete messages (F-02), and speak (send transport), not merely observe.
- Harassment, eavesdropping, and disruption of private conversations.
- If the room is used for sensitive discussions, confidentiality is lost.

#### PoC outline (synthetic)

1. Victim `V` is in private room `R`; their username is public.
2. Attacker calls `GET /user/V` and reads `currentRoomId: R`.
3. Attacker authenticates, sends `room:join` with `roomId: R`.
4. `can_join_room` succeeds (unless full/blocked); `join_vc_room` sees `room.isPrivate` and gives the attacker a send transport.
5. Attacker reads/sends chat and can speak.

#### Remediation

- Define private rooms as access-controlled: require an invite list, a signed join token, or creator/mod approval.
- Do not expose `currentRoomId` for private rooms in public user responses; return it only to the user themselves or authorized followers.
- Add an `isPrivate` check in `can_join_room` and a separate invite/ACL path.
- Do not auto-grant speaker in private rooms; require explicit speaker permission.
- Audit `GET /room/:id` and `GET /user/:username` for other room metadata leaks.

#### Detection

- Alert on joins to private rooms without an invite record.
- Monitor `GET /user/:username` enumeration patterns.
- Track private-room joins from users with no prior relationship to the creator.

---

### F-08 — Electron Node integration + allowed-host navigation → conditional RCE

**Severity:** High (conditional on content injection or attacker-controlled allowed host)
**Confidence:** Confirmed configuration; exploitability conditional
**CWE:** CWE-829 (Inclusion of Functionality from Untrusted Control Sphere), CWE-78 (OS Command Injection via renderer), CWE-1188 (Insecure Default)
**Affected:** `baklava` desktop build
**Location:**
- `baklava/src/electron.ts:68-95, 139-163, 201-212, 46-48`
- `baklava/src/constants.ts:22-32`
- `baklava/src/utils/overlay/index.ts:5-17`
- `baklava/src/utils/keybinds.ts:123-140`
- `globalkey/src/lib.rs:12-43`
- `baklava/package.json:105, 120`

#### Summary

The Electron main window loads remote `https://dogehouse.tv/` with `nodeIntegration: true` and `contextIsolation: false`. The `will-navigate`/`new-window` handler only blocks hosts **not** in `ALLOWED_HOSTS`; allowed hosts (including `localhost`, `staging.dogehouse.tv`, and `doge-staging.stripcode.dev`) are allowed to load inside the Node-enabled window. Any XSS, malicious content on an allowed host, or attacker-controlled localhost service therefore executes with Node/OS privileges. `autoUpdater.allowDowngrade = true` adds update-supply-chain risk.

#### Evidence

```ts
// baklava/src/electron.ts:68-95
mainWindow = new BrowserWindow({
  width: 1500, height: 800, minWidth: 400, minHeight: 600,
  autoHideMenuBar: true,
  webPreferences: {
    nodeIntegration: true,
    contextIsolation: false,
  },
  frame: isLinux,
  show: false,
});
...
mainWindow.loadURL(__prod__ ? `https://dogehouse.tv/` : "http://localhost:3000");
```

```ts
// baklava/src/electron.ts:139-163
const handleLinks = (event: any, url: string) => {
  let urlObj = new URL(url);
  let urlHost = urlObj.hostname;
  if (!ALLOWED_HOSTS.includes(urlHost)) {
    event.preventDefault();
    shell.openExternal(url);
  } else {
    if (
      (urlHost == ALLOWED_HOSTS[3] && urlObj.pathname !== "/login" && ...) ||
      (urlHost == ALLOWED_HOSTS[8] && urlObj.pathname !== "/account/login_verification")
    ) {
      event.preventDefault();
      shell.openExternal(url);
    }
  }
};
mainWindow.webContents.on("new-window", handleLinks);
mainWindow.webContents.on("will-navigate", handleLinks);
```

```ts
// baklava/src/constants.ts:22-32
export const ALLOWED_HOSTS = [
  "dogehouse.tv",
  "next.dogehouse.tv",
  "api.dogehouse.tv",
  "github.com",
  "localhost",
  "staging.dogehouse.tv",
  "doge-staging.stripcode.dev",
  "api.twitter.com",
  "twitter.com",
];
```

```ts
// baklava/src/electron.ts:46-48
// just in case we have to revert to a build
autoUpdater.allowDowngrade = true;
```

Splash window:

```ts
// baklava/src/electron.ts:201-212
splash = new BrowserWindow({
  width: 300, height: 410, transparent: true, frame: false, resizable: false,
  webPreferences: { nodeIntegration: true, contextIsolation: false },
});
```

Overlay:

```ts
// baklava/src/utils/overlay/index.ts:5-17
const overLay = new BrowserWindow({
  width: 400, height: 300,
  webPreferences: { nodeIntegration: true },
  ...OW.WINDOW_OPTS,
});
overLay.loadFile(path.join(__dirname, "../../resources/overlay/build/index.html"));
```

#### Why it works

- `nodeIntegration: true` gives the renderer access to `require`, `process`, and Node APIs.
- `contextIsolation: false` removes the isolated-world boundary; page JavaScript and preload share the same context.
- `will-navigate` does not call `event.preventDefault()` for allowed hosts; navigation proceeds in the same BrowserWindow.
- `new-window` similarly allows allowed hosts; the child window may inherit the parent's web preferences, and even if not, the same-window path is enough.
- `localhost` is allowed with no path restriction, so a link to `http://localhost:<port>/...` loads attacker-controlled local content in the privileged window.
- Staging hosts are allowed, so a staging compromise or user-controlled content on staging can reach the desktop renderer.
- `allowDowngrade = true` means a compromised update manifest can serve an older, vulnerable build; `electron-updater@4.3.8` also has a code-signing bypass advisory (requires a compromised manifest/MITM/XSS).

#### Impact

- **OS-level code execution** in the context of the desktop user: read files, install persistence, access tokens, microphone/camera, clipboard, SSH keys, etc.
- **Token theft**: `localStorage` tokens and IPC-exposed functionality are reachable.
- **Potential global keylogging**: the native `globalkey` addon polls all keyboard keys; a Node-enabled renderer may be able to load the addon and register its own callback, depending on module resolution. This is a plausible defence-in-depth failure, not a separately verified exploit. See `globalkey/src/lib.rs:12-43`.
- **Update supply chain**: downgrade + code-signing bypass can turn a manifest compromise into persistent compromise.

#### Preconditions

- Victim clicks an attacker-supplied chat link to an allowed host (e.g., `http://localhost:<port>/payload`), or the attacker controls content on an allowed staging host, or an XSS exists in the web app.
- For the localhost path, the attacker needs a service listening on the victim's machine (malware, another app, or a local dev server). The chat link alone is not enough if nothing is listening.
- For the staging path, the attacker needs to control/inject content on a staging host.

#### PoC outline (synthetic, no live target)

1. Attacker posts `http://localhost:31337/payload` in chat.
2. Victim clicks the link. Electron's `will-navigate` sees host `localhost` in `ALLOWED_HOSTS`, does not prevent navigation, and loads the page in the Node-enabled main window.
3. The page executes `require("child_process").exec("...")` (details omitted) and gains the user's OS privileges.
4. Alternatively, any XSS on `dogehouse.tv` achieves the same without a navigation.

#### Remediation

- Set `nodeIntegration: false`, `contextIsolation: true`, `sandbox: true`, and `webSecurity: true` on all windows.
- Expose only a minimal, validated API through a preload script and `contextBridge`.
- Deny all navigation to non-app origins; use `will-navigate` with `event.preventDefault()` for anything outside the exact production origin, and `setWindowOpenHandler` to deny or open externally.
- Remove `localhost` and staging hosts from the production allowlist; use a build-time allowlist.
- Open external links only via `shell.openExternal` after strict URL validation.
- Set `autoUpdater.allowDowngrade = false`; upgrade `electron-updater`; verify code signatures; use a pinned update channel.
- Upgrade Electron 12 (EOL) to a supported release.
- Do not expose the native `globalkey` addon to the renderer.

#### Detection

- Log Electron navigations and new-window events with the destination origin; alert on any origin outside the production app.
- Alert on updates to versions older than the current one.
- Monitor for `child_process` usage from renderer processes in EDR.

---

### F-09 — IP ban evasion/framing via trusted `X-Forwarded-For`

**Severity:** Medium
**Confidence:** Confirmed mechanism; impact depends on proxy configuration
**CWE:** CWE-348 (Use of Less Trusted Source), CWE-290 (Authentication Bypass by Spoofing)
**Affected:** `staging` and `origin/prod` when deployed behind a proxy that does not sanitise the header
**Location:**
- `kousa/lib/broth/socket_handler.ex:45-48`
- `kousa/lib/kousa/auth.ex:43-45`
- `kousa/lib/beef/room_blocks.ex:14-23`
- `kousa/lib/kousa/room.ex:99-108`
- `kousa/lib/beef/mutations/users.ex:43-46`

#### Summary

The WebSocket handler takes `request.headers["x-forwarded-for"]` verbatim as the client IP. Authentication stores it on the user record. Room IP bans compare the joining user's stored IP to blocked IPs. A client can therefore choose its stored IP, evade an IP ban by changing the header, or (with a moderator ban) cause a victim's IP to be added to a room's block list.

#### Evidence

```elixir
# kousa/lib/broth/socket_handler.ex:45-48
ip = request.headers["x-forwarded-for"]

state = %__MODULE__{
  ip: ip,
  ...
}
```

```elixir
# kousa/lib/kousa/auth.ex:43-45
if user.ip != ip do
  Beef.Users.set_ip(user.id, ip)
end
```

```elixir
# kousa/lib/beef/room_blocks.ex:14-23
def blocked?(room_id, user_id) do
  ip = Users.get_ip(user_id)
  not is_nil(
    from(rb in RoomBlock,
      where: (rb.userId == ^user_id or rb.ip == ^ip) and rb.roomId == ^room_id,
      limit: 1
    ) |> Beef.Repo.one()
  )
end
```

```elixir
# kousa/lib/kousa/room.ex:99-108
def block_from_room(user_id, user_id_to_block_from_room, should_ban_ip \\ false) do
  with {status, room} when status in [:creator, :mod] <- Rooms.get_room_status(user_id) do
    if room.creatorId != user_id_to_block_from_room do
      RoomBlocks.upsert(%{
        modId: user_id,
        userId: user_id_to_block_from_room,
        roomId: room.id,
        ip: if(should_ban_ip, do: Users.get_ip(user_id_to_block_from_room), else: nil)
      })
      internal_kick_from_room(user_id_to_block_from_room, room.id)
    end
  end
end
```

#### Why it works

- The header is client-controlled unless a trusted reverse proxy overwrites/strips it. The code does not use `conn.remote_ip` or a trusted-proxy parser.
- The value is stored as-is and later compared for IP bans.
- A banned user can reconnect with a different `X-Forwarded-For` value and appear as a new IP.
- A malicious moderator can use an alt account with a spoofed `X-Forwarded-For` matching a victim's IP, then ban that alt with `shouldBanIp: true`, poisoning the room's IP block list. The victim is then blocked when their real stored IP matches.
- If multiple users share a NAT/proxy IP, an IP ban can affect uninvolved users (collateral).

#### Impact

- IP bans are unreliable: trivially evaded by an attacker who can set the header.
- Targeted denial: a moderator can frame a victim's IP and block them from a room.
- Collateral blocking of NAT/shared IPs.
- Audit/moderation confusion: stored IPs are not trustworthy.

#### Preconditions

- Deployment accepts client-supplied `X-Forwarded-For` (common when the app is directly exposed or the proxy appends without stripping).
- For framing, a moderator/creator willing to ban an alt with a spoofed IP.

#### Remediation

- Trust only a proxy-set header; strip incoming `X-Forwarded-For` at the edge and set it from the actual connection.
- Use `Plug.Conn.remote_ip` when directly exposed; use a validated proxy chain when behind a trusted load balancer.
- Normalise and validate IP addresses; reject malformed values.
- Do not rely on IP bans as a primary control; combine with account/device signals and rate limits.
- Rate-limit reconnects and IP changes.
- Audit IP-ban records and provide an appeals path.

#### Detection

- Alert on frequent `X-Forwarded-For` changes for one account.
- Alert on IP bans whose IP belongs to a different ASN than the banned account's usual traffic.
- Monitor for many accounts sharing one stored IP.

---

### F-10 — Production compose inherits published database/management ports

**Severity:** Medium (deployment-dependent)
**Confidence:** Confirmed configuration; exposure depends on host firewall/network
**CWE:** CWE-1327 (Binding to an Unrestricted IP Address), CWE-306 (Missing Authentication for Critical Function)
**Affected:** Deployments using `docker-compose.yml` plus `docker-compose.prod.yml`
**Location:**
- `docker-compose.yml:19-29` (RabbitMQ `5672`, `15672`)
- `docker-compose.yml:50-58` (Postgres `5432`)
- `docker-compose.yml:60-68` (Adminer `8080`)
- `docker-compose.prod.yml:10-25` (override does not remove `ports`)

#### Summary

The base compose file publishes Postgres, RabbitMQ (including the management UI), and Adminer on the host. The production override adds images and env files but does not remove or bind those ports. If the host firewall allows inbound traffic, the database and management interfaces are reachable from the network.

#### Evidence

```yaml
# docker-compose.yml:19-29
rabbitmq:
  image: rabbitmq:3-management-alpine
  volumes:
    - ./.docker/rabbitmq/data/:/var/lib/rabbitmq/
    - ./.docker/rabbitmq/logs/:/var/log/rabbitmq/
  ports:
    - 5672:5672
    - 15672:15672
```

```yaml
# docker-compose.yml:50-68
postgres:
  image: postgres:13-alpine
  volumes:
    - ./.docker/postgres:/var/lib/postgresql/data
  ports:
    - 5432:5432

adminer:
  image: adminer
  ports:
    - 8080:8080
  depends_on:
    - postgres
```

```yaml
# docker-compose.prod.yml:10-25
services:
  shawarma:
    image: dogehouse/shawarma
    env_file:
      - shawarma.env
  kousa:
    image: dogehouse/kousa
    env_file:
      - kousa.env
  postgres:
    env_file:
      - pg.env
  rabbitmq:
    env_file:
      - rabbit.env
  adminer:
```

#### Why it works

- Docker publishes container ports on `0.0.0.0` by default.
- The prod override does not redefine `ports`, so the base mappings remain when the files are combined.
- Adminer has no built-in authentication beyond the database credentials; a reachable Adminer is an attack surface for credential brute force, SSRF, and known Adminer vulnerabilities.
- RabbitMQ management may be reachable with default/weak credentials if `rabbit.env` is misconfigured; Postgres may be reachable with weak credentials from `pg.env`.

No production secrets were found in the repository; the risk is exposure of services and whatever credentials are supplied at deploy time.

#### Impact

- Direct database access if Postgres credentials are weak/leaked: read/write all users, rooms, messages, tokens, IPs.
- RabbitMQ management/AMQP access: inject voice commands, read queues, disrupt service.
- Adminer as a pivot/brute-force interface.
- Internet-wide scanners routinely find exposed `5432`, `15672`, and `8080`.

#### Remediation

- Remove `ports` from the production override entirely, or bind to `127.0.0.1` only:
  ```yaml
  ports:
    - "127.0.0.1:5432:5432"
  ```
- Put Postgres/RabbitMQ/Adminer on an internal Docker network with no host publishing.
- Do not deploy Adminer to production; use a bastion/VPN.
- Use strong, unique credentials from a secret manager; rotate if exposure is suspected.
- Enforce host firewall/security-group rules and network policies.

#### Detection

- Scan for exposed `5432`, `5672`, `15672`, `8080` from outside.
- Alert on connections to these ports from non-management networks.
- Audit container port mappings in CI/deployment policy.

---

### F-11 — Whisper fan-out to an unbounded recipient list

**Severity:** Low–Medium
**Confidence:** Confirmed mechanism
**CWE:** CWE-770 (Allocation of Resources Without Limits or Throttling), CWE-799 (Improper Control of Interaction Frequency)
**Affected:** `staging` and `origin/prod`
**Location:**
- `kousa/lib/broth/message/chat/send.ex:14, 99-123`
- `kousa/lib/onion/chat.ex:288-310`
- `kousa/lib/kousa/auth.ex:84-87`

#### Summary

A whisper can target an arbitrary list of UUIDs. The server validates that each is a UUID, then broadcasts the message to `chat:<recipient_id>` for every recipient. There is no maximum recipient count, no relationship check, no room check, and no per-recipient rate limit. The chat throttle is one message per second per room, but each message can fan out to thousands of recipients.

#### Evidence

```elixir
# kousa/lib/broth/message/chat/send.ex:14
field(:whisperedTo, {:array, :binary_id})
```

```elixir
# kousa/lib/onion/chat.ex:288-310
defp dispatch_message(payload, state) do
  case payload.whisperedTo do
    [] ->
      PubSub.broadcast("chat:" <> state.room_id, %Broth.Message{
        operator: "chat:send", payload: payload
      })
      :ok
    list ->
      list
      |> List.insert_at(0, payload.from)
      |> Enum.uniq
      |> Enum.each(fn recipient_id ->
        PubSub.broadcast("chat:" <> recipient_id, %Broth.Message{
          operator: "chat:send", payload: payload
        })
      end)
  end
end
```

Authenticated users subscribe to their own whisper channel:

```elixir
# kousa/lib/kousa/auth.ex:84-87
# subscribe to chats directed to oneself.
PubSub.subscribe("chat:" <> user.id)
# subscribe to user updates
PubSub.subscribe("user:update:" <> user.id)
```

#### Why it works

- `whisperedTo` is a client-controlled array.
- UUID normalization does not check that the target exists, is a real user, shares a room, or has a relationship with the sender.
- The only throttle is one message per second per room; the fan-out work and delivery are proportional to the list length.
- The sender can include thousands of UUIDs (subject to WebSocket frame size), causing one-to-many broadcast and notification spam.
- The receiver-side block check drops messages from blocked senders, but the sender can target users who have not blocked them.

#### Impact

- Mass unsolicited whispering/phishing/spam.
- CPU/PubSub/network amplification: one message becomes N deliveries.
- Notification fatigue and harassment.
- Potential resource exhaustion if combined with many connections or large lists.

#### Remediation

- Cap `whisperedTo` at a small number (e.g., 5–20).
- Require a mutual-follow or shared-room relationship.
- Apply per-recipient and per-sender rate limits, not just per-room.
- Validate that each recipient exists and has not blocked the sender.
- Queue/backpressure fan-out; consider batching.

#### Detection

- Alert on whispers with unusually large recipient lists.
- Monitor per-user whisper volume and unique recipients.
- Rate-limit and flag repeated mass whispers.

---

### F-12 — Unbounded chat-token array allows CPU/memory amplification

**Severity:** Low
**Confidence:** Confirmed code property; DoS impact not dynamically tested
**CWE:** CWE-770 (Allocation of Resources Without Limits or Throttling)
**Affected:** `staging` and `origin/prod`
**Location:**
- `kousa/lib/broth/message/chat/send.ex:50-87`
- `kousa/lib/broth/message/_types/chat_token.ex:31-37`

#### Summary

The message length limit is enforced by summing token text lengths, but there is no limit on the number of tokens. An attacker can send a huge array of empty or tiny tokens with one non-empty token; the total length passes, but the server builds an Ecto changeset for every token. This is a CPU/memory amplification vector.

#### Evidence

```elixir
# kousa/lib/broth/message/chat/send.ex:50-87
def put_tokens(changeset, tokens) when is_list(tokens) do
  {embedded_tokens, acc_length} =
    Enum.map_reduce(tokens, 0, &apply_changeset_accumulate_length/2)

  if acc_length == 0 do
    throw(tokens: {"no empty messages", []})
  end

  put_embed(changeset, :tokens, embedded_tokens)
rescue
  _ in Ecto.CastError -> add_error(changeset, :tokens, "is invalid")
catch
  errors -> %{changeset | errors: errors ++ changeset.errors, valid?: false}
end
```

```elixir
# kousa/lib/broth/message/_types/chat_token.ex:31-37
def changeset(changeset, data) do
  changeset
  |> cast(data, [:type, :value])
  # I removed :value because an empty string for a single token is ok
  |> validate_required([:type])
  |> validate_length(:value, min: 0, max: @message_character_limit)
  |> validate_link
end
```

#### Why it works

- `acc_length` counts only text bytes; empty tokens contribute zero.
- One non-empty token plus many empty tokens passes `acc_length > 0`.
- Each token creates a changeset with validations; the work is O(number of tokens), not O(message length).
- The per-room 1 message/second throttle limits rate but not the cost of a single large message; many connections amplify.

#### Impact

- CPU/memory spikes in the chat process, which is single-threaded per room.
- Potential latency for all users in the room; with many rooms/connections, broader resource pressure.
- Low severity because WebSocket frame size and the 1/sec throttle constrain the attack; still worth fixing.

#### Remediation

- Enforce a maximum token count (e.g., 200) in addition to total length.
- Reject empty tokens beyond a small allowance.
- Limit WebSocket frame size and JSON nesting/size at the edge.
- Add per-user CPU/time budgets and backpressure.

#### Detection

- Alert on messages with token counts far above normal.
- Monitor chat-process latency and memory.

---

### F-13 — `UUID.normalize/1` corrupts uppercase hex

**Severity:** Low
**Confidence:** Confirmed
**CWE:** CWE-704 (Incorrect Type Conversion or Cast)
**Affected:** `staging` and `origin/prod`
**Location:** `kousa/lib/kousa/utils/uuid.ex:32`

#### Summary

The normalizer intends to lowercase uppercase hex characters but subtracts 32 instead of adding 32. Uppercase `A`–`F` (65–70) become `!`–`&` (33–38), producing invalid UUID bytes. Any client that sends an uppercase UUID can hit inconsistent failures depending on which operator normalizes it.

#### Evidence

```elixir
# kousa/lib/kousa/utils/uuid.ex:32
defp lower(char) when char in ?A..?F, do: char - 32
defp lower(char), do: char
```

Correct behavior would be `char + 32` (or `String.downcase/1`).

#### Impact

- Uppercase UUIDs are rejected or stored incorrectly.
- `set_role` has an additional bug: it normalizes `:id` instead of `:userId`, so its target ID is not normalized at all.
- Mostly robustness/availability; could cause confusing authorization failures.
- Not a direct privilege escalation.

#### Remediation

- Change to `char + 32` and add property tests for all hex cases.
- Fix `set_role.ex:22` to `UUID.normalize(:userId)`.
- Consider using `Ecto.UUID.cast/1` and enforcing UUIDv4.

#### Detection

- Log UUID validation failures; alert on spikes.

---

### F-14 — Nil dereference and test-only module in production manifest

**Severity:** Low
**Confidence:** Confirmed
**CWE:** CWE-476 (NULL Pointer Dereference), CWE-489 (Active Debug Code)
**Affected:** `staging` and `origin/prod`
**Location:**
- `kousa/lib/kousa/user.ex:11-15`
- `kousa/lib/broth/message/manifest.ex:9`

#### Summary

`revoke_api_key/2` calls `user.id` without checking that `Users.get_by_id(bot_id)` returned a user; an unknown bot ID raises and crashes the WebSocket process. The production manifest also maps `test:operator` to `BrothTest.MessageTest.TestOperator`, a test-only module that is not part of a release; sending it raises.

#### Evidence

```elixir
# kousa/lib/kousa/user.ex:11-15
def revoke_api_key(user_id, bot_id) do
  user = Users.get_by_id(bot_id)

  if user.id != user_id and user.botOwnerId != user_id do
    {:error, "not authorized"}
  else
    # ...
  end
end
```

```elixir
# kousa/lib/broth/message/manifest.ex:9
"test:operator" => BrothTest.MessageTest.TestOperator,
```

#### Impact

- An authenticated user can crash their own WebSocket process by sending `user:revoke_api_key` with a non-existent bot ID; repeated reconnects cause log noise and resource churn.
- `test:operator` is a latent crash/undefined-module path.
- Low severity because it is per-connection, not a shared-process crash.

#### Remediation

- Guard `is_nil(user)` and return a generic error.
- Remove `test:operator` from the production manifest or compile it only in test.
- Add error handling around operator execution so a single bad message does not crash the socket.

#### Detection

- Alert on repeated `user:revoke_api_key` failures and WebSocket crashes.

---

### F-15 — Mod self-demotion writes `isMod: true` while broadcasting `false`

**Severity:** Low
**Confidence:** Confirmed
**CWE:** CWE-670 (Always-Incorrect Control Flow Implementation)
**Affected:** `staging` and `origin/prod`
**Location:** `kousa/lib/kousa/room.ex:192-208`

#### Summary

When a mod demotes themselves, the first `set_user/3` clause calls `RoomPermissions.set_is_mod(user_id, room_id, true)` but broadcasts `isMod: false`. The database keeps mod rights while the UI tells everyone the user is no longer a mod.

#### Evidence

```elixir
# kousa/lib/kousa/room.ex:192-208
defp set_user(room_id, user_id, user_id) do
  case Rooms.get_room_status(user_id) do
    {:mod, _} ->
      RoomPermissions.set_is_mod(user_id, room_id, true)   # should be false
      Onion.RoomSession.broadcast_ws(room_id, %{
        op: "mod_changed",
        d: %{roomId: room_id, userId: user_id, isMod: false}
      })
    _ -> :noop
  end
end
```

#### Impact

- A user who believes they have relinquished mod status retains kick/ban/delete powers.
- Audit/moderation confusion; potential for unnoticed privileged access.
- Not a direct escalation (the user was already a mod), but a correctness/security-state bug.

#### Remediation

- Set `false` and add a test that reads back the permission after self-demotion.
- Broadcast only after a successful write; use a transaction.

#### Detection

- Compare `room_permissions.isMod` with the last `mod_changed` event; alert on divergence.

---

### F-16 — Dependency risk and advisory applicability

**Severity:** Low / informational (version presence; exploitability mostly unproven)
**Confidence:** Version-confirmed via OSV; applicability assessed statically
**Affected:** `staging` and `origin/prod`

#### Versions reviewed

| Package | Version | OSV advisories | Assessment |
|---|---|---|---|
| `next` | 10.2.0 | 17 | EOL. Most advisories are image-optimizer, middleware, rewrites, or 404-related. `next/image` is not used, `images.domains` is not configured, `src/pages/404.tsx` exists, and no middleware/rewrites were found. Image-optimizer endpoint exposure should still be tested/disabled. |
| `electron` | 12.0.2 | 55 | EOL; large attack surface. Upgrade to a supported major. Many advisories are context-dependent, but the app’s Node integration makes renderer compromise severe. |
| `electron-updater` | 4.3.8 | 1 (`GHSA-9jxc-qjr9-vjxq`) | Windows code-signing bypass; requires a compromised update manifest, MITM, or XSS to point at a malicious updater. `allowDowngrade = true` increases impact. |
| `ws` | 7.4.4 | 3 | Present in `shawarma` dependency tree; no WebSocket server usage was found in `shawarma/src`. Likely unreachable, but remove/upgrade. |
| `jsonwebtoken` | 8.5.1 | 3 | Present in `shawarma` dependency tree; no `jsonwebtoken` usage was found in `shawarma/src`. Likely unreachable. |
| `normalize-url` | 4.5.0 | 1 (`GHSA-px4h-xg32-q955`) | ReDoS is specific to `data:` URLs. Server-side link tokens only allow `http`/`https` (`chat_token.ex:48-63`), so the known payload is not directly reachable through chat links. Upgrade anyway. |

#### Notes

- OSV counts are as of the report date and can change.
- Version presence is not proof of exploitability. The table distinguishes “present” from “reachable”.
- Next.js image-optimizer advisories deserve a runtime test even though the app does not use `<Image>`; the `/_next/image` route may still exist.
- The Electron findings (F-08) are more important than the raw advisory count.

#### Remediation

- Upgrade Next.js, Electron, electron-updater, `ws`, `jsonwebtoken`, and `normalize-url` to supported versions.
- Remove unused dependencies (`ws`, `jsonwebtoken` in `shawarma`) to reduce supply-chain surface.
- Add automated SCA (Dependabot/Renovate/OSV-Scanner) in CI.
- Pin and verify lockfiles; review transitive updates.

---

### F-17 — Missing security headers and token storage hardening

**Severity:** Low (defence-in-depth; amplifies F-06/F-08)
**Confidence:** Confirmed
**CWE:** CWE-693 (Protection Mechanism Failure), CWE-522 (Insufficiently Protected Credentials)
**Affected:** `staging` and `origin/prod` web client
**Location:**
- `kibbeh/next.config.js:1-16`
- `kibbeh/src/modules/auth/useTokenStore.ts:5-6, 24-34`
- `kousa/lib/broth/plugs/redirect.ex:4-11`

#### Summary

The Next.js config sets no security headers (CSP, `Referrer-Policy`, `X-Content-Type-Options`, `X-Frame-Options`/`frame-ancestors`, HSTS, Permissions-Policy). Tokens are stored in `localStorage`, readable by any same-origin script. OAuth redirects put tokens in query strings. These are not direct vulnerabilities without an injection, but they sharply increase the blast radius of any XSS or malicious dependency, especially in Electron.

#### Evidence

```js
// kibbeh/next.config.js:1-16
const withTM = require("next-transpile-modules")(["@dogehouse/kebab"]);

module.exports = withTM({
  future: { webpack5: true },
  reactStrictMode: true,
  typescript: {
    // ...
  },
});
```

No `headers()`, CSP, or `Referrer-Policy` configuration.

```ts
// kibbeh/src/modules/auth/useTokenStore.ts:5-6, 26-30
const accessTokenKey = "@toum/token";
const refreshTokenKey = "@toum/refresh-token";
...
localStorage.setItem(accessTokenKey, x.accessToken);
localStorage.setItem(refreshTokenKey, x.refreshToken);
```

#### Impact

- Any XSS or malicious dependency can read and exfiltrate long-lived tokens.
- Tokens in URLs can leak via Referer, browser history, logs, and extensions.
- No CSP means inline script injection is easier to exploit.
- In Electron, `localStorage` tokens plus Node integration turn XSS into full account and OS compromise.

#### Remediation

- Set a strict CSP (no `unsafe-inline` where possible), `Referrer-Policy: no-referrer`, `X-Content-Type-Options: nosniff`, `frame-ancestors 'none'`, HSTS, and Permissions-Policy.
- Move tokens to HttpOnly/Secure/SameSite cookies, or use short-lived in-memory access tokens plus a refresh flow.
- Strip tokens from URLs immediately; use one-time codes.
- Add Subresource Integrity for third-party scripts.
- Add security-header tests in CI.

#### Detection

- Monitor for missing headers with external scanners.
- Alert on token use from unexpected origins/user agents.

---

### F-18 — Push-to-talk release does not re-mute the microphone

**Severity:** Low (privacy)
**Confidence:** Confirmed
**CWE:** CWE-15 (External Control of System or Configuration Setting), privacy exposure
**Affected:** `baklava` desktop client
**Location:**
- `baklava/src/utils/keybinds.ts:123-140`
- `kibbeh/src/modules/keyboard-shortcuts/KeybindListener.tsx:56-60`

#### Summary

The global key listener computes PTT status only on keydown and passes an empty callback for keyup. On release, the status is not recomputed, so the renderer is not told to mute. The microphone remains open until the next keydown.

#### Evidence

```ts
// baklava/src/utils/keybinds.ts:123-140
globalkey.start(
  down => {
    down.forEach((key: any) => {
      let i = down.indexOf(key);
      down[i] = down[i].replace("L", "");
      down[i] = down[i].replace("R", "");
      down[i] = down[i].replace("Key", "");
    });
    down = down.sort();
    const keyString = down.join().toLowerCase();
    let PTT = keyString !== CURRENT_PTT_KEY_STRING;
    if (PREV_PTT_STATUS !== PTT) {
      bWindows.main.webContents.send("@voice/ptt_status_change", PTT);
      PREV_PTT_STATUS = PTT;
    }
  },
  up => { }
);
```

```tsx
// kibbeh/src/modules/keyboard-shortcuts/KeybindListener.tsx:56-60
const PTT_STATUS_CHANGE_FUNC = (event: any, status: boolean) => {
  if (!event) return;
  const mute = status;
  setMute(wrapper, mute);
};
```

#### Why it works

- PTT is true (muted) when the pressed key set differs from the configured PTT key.
- While the PTT key is held, PTT is false (unmuted).
- On release, `up` does nothing; `PREV_PTT_STATUS` stays false, so no mute event is sent.
- The next keydown recomputes and may mute, but until then the mic is live.

#### Impact

- Hot microphone after releasing PTT; nearby speech is transmitted unintentionally.
- Privacy risk in home/office environments.
- Not a remote exploitation primitive, but a real user-safety defect.

#### Remediation

- Implement the `up` callback to recompute PTT and send the status when the key set no longer matches.
- Alternatively, treat any keyup of the PTT chord as “mute” immediately.
- Add a unit test for press/release/other-key sequences.
- Show a visible mic state indicator.

#### Detection

- Client telemetry for PTT state vs. key state; QA regression tests.

---

## 6. Exploit Chains

The following chains are synthetic descriptions for defenders. They assume the analysed commit and ordinary deployment behavior; no live system was targeted.

### Chain A — Two-account cross-room moderation takeover (F-01 → F-02/F-09)

**Preconditions:** Attacker controls account `A` and alt/bot `B`; target room `R` has users; `B` can join `R` (public, or private by ID per F-07).

1. `A` creates a throwaway room `RA` via `room:create`; `A` is creator and remains in `RA`.
2. `B` joins `R`.
3. `A` sends `room:set_auth` with `B`'s ID and `level:"mod"`.
   - Server resolves `room_id = R` from `B.currentRoomId`.
   - `set_mod` checks `A` is creator of `RA`.
   - Writes `B` as mod in `R`; broadcasts `mod_changed` to `R`.
4. `B` now has real DB-backed mod powers in `R`:
   - `room:ban` to kick/IP-ban users (except the creator).
   - `chat:delete` to erase messages (F-02).
   - `room:set_role` to mute/demote speakers.
5. `A` can additionally demote `R`'s existing mods (`level:"user"`) and speakers (`room:set_role` → `listener`), because `A` remains creator of `RA`.

**Impact:** Full moderation takeover/disruption of an arbitrary room with two accounts. The attacker does not need to be in `R`; only `B` does.

**Why two accounts:** A single attacker cannot promote themselves in `R` because `set_auth` resolves the target's current room; if the target is the attacker, the room is `RA`, not `R`. A second account/bot in `R` is the bridge.

### Chain B — Listener wipes a room's chat (F-02)

**Preconditions:** Attacker can join the target room; message IDs are visible in received `chat:send` payloads.

1. Attacker joins `R` as a listener.
2. Attacker collects `messageId` values from live messages.
3. For each message, sends:
   ```json
   {"op":"chat:delete","d":{"messageId":"<M>","userId":"<ATTACKER>"}}
   ```
4. Server authorizes the listener because `user_id == deletion.userId`, never checks the message author, and broadcasts the deletion to `R`.
5. All clients remove the messages.

**Impact:** Real-time chat destruction, harassment, evidence removal. No throttle; the attacker can delete at WebSocket speed.

### Chain C — Ban evasion with a custom client (F-03)

**Preconditions:** Attacker has an authenticated WebSocket and an access token.

1. Attacker behaves abusively in a room.
2. Admin bans: server sets `reasonForBan`, leaves the room, sends `{"op":"banned"}`.
3. Custom client ignores `banned` and keeps the socket open; `state.user` is still set.
4. Attacker sends `room:join` for another room; no platform-ban check prevents it.
5. If the socket closes, attacker reconnects with the same access token within one hour; `tokens_to_user_id` accepts it on signature alone.

**Impact:** Ban is advisory to the official client; enforcement lasts at most one hour for reconnects, and indefinitely for an open socket.

### Chain D — Staging account takeover via `/dev/test-info` (F-04)

**Preconditions:** `IS_STAGING=true` (or `env == :dev`), known username, network access to staging.

1. `GET https://<staging-api>/dev/test-info?username=<staff>`.
2. Response contains valid `accessToken` and `refreshToken` for that user.
3. Authenticate a WebSocket with the tokens.
4. Use the impersonated identity: join rooms, moderate, read chat, etc. If the user is Ben, `user:ban`/`user:admin_update` become available; other staff can use `user:admin_update`.

**Impact:** Full staging account takeover, including staff, without OAuth. If the flag is misconfigured in production, production account takeover.

### Chain E — OAuth token exfiltration on staging (F-05)

**Preconditions:** `IS_STAGING=true`; victim completes GitHub/Discord login.

1. Attacker sends victim `https://<staging-api>/auth/github/web?redirect_after_base=https://attacker.example`.
2. Victim authenticates.
3. Callback redirects to `https://attacker.example/?accessToken=...&refreshToken=...`.
4. Attacker records the tokens and uses them.

**Impact:** Account takeover of any user who completes the flow; staff accounts are high value.

### Chain F — Private room discovery and join (F-07)

**Preconditions:** Victim is online in a private room; username known; room not full; attacker not blocked.

1. `GET /user/<victim>` returns `currentRoomId`.
2. Attacker `room:join` with that ID.
3. `can_join_room` does not check `isPrivate`; join succeeds.
4. `join_vc_room(..., canSpeak || room.isPrivate)` gives a send transport.
5. Attacker reads/sends chat, deletes messages, and speaks.

**Impact:** Private conversations are effectively public-by-username; confidentiality and integrity loss.

### Chain G — Electron RCE via allowed-host navigation (F-08)

**Preconditions:** Victim clicks an attacker-supplied chat link to an allowed host, or an XSS exists; for localhost, a service is listening on the victim machine.

1. Attacker posts `http://localhost:<port>/payload` (or a staging link) in chat.
2. Victim clicks. Electron's `will-navigate` sees an allowed host and does not prevent navigation.
3. The page loads in the main window with `nodeIntegration: true` / `contextIsolation: false`.
4. The page executes Node code with the user's OS privileges.

**Impact:** OS-level compromise, token theft, file access, persistence, microphone/camera; potential global keylogging if the renderer can load the native `globalkey` addon.

### Chain H — IP ban evasion/framing (F-09)

**Preconditions:** Client-supplied `X-Forwarded-For` reaches the app; for framing, a moderator ban.

1. Banned attacker reconnects with `X-Forwarded-For: <new value>`; `do_auth` stores it; `RoomBlocks.blocked?` no longer matches.
2. For framing: a malicious mod uses an alt with `X-Forwarded-For: <victim IP>`, then bans the alt with `shouldBanIp: true`; the victim's IP is now blocked in the room.
3. Victim is denied when their stored IP matches.

**Impact:** IP bans are unreliable; targeted denial and collateral NAT blocking.

---

## 7. Severity and Applicability Matrix

| ID | Finding | Severity | Auth required | User interaction | Production | Staging | Confidence |
|---|---|---|---|---|---|---|---|
| F-01 | Cross-room role authorization | High | Yes (any creator) | No (second account) | Yes (core); `set_owner` runtime side effect staging-only | Yes | High |
| F-02 | Arbitrary message deletion | High | Yes (listener) | No | Yes | Yes | High |
| F-03 | Ban session persistence | High | Yes (banned user) | No | Yes | Yes | High |
| F-04 | `/dev/test-info` token minting | Critical (staging) | No | No | No by default | Yes | High |
| F-05 | OAuth redirect token leak | High (staging) | No | Yes (login) | No by default | Yes | High |
| F-06 | Login CSRF / URL tokens | Medium | No | Yes (link click) | Yes | Yes | High |
| F-07 | Private rooms unlisted + ID leak | Medium | Yes (join) | No | Yes | Yes | High |
| F-08 | Electron Node integration RCE | High (conditional) | No | Yes (link click/XSS) | Desktop build | Desktop build | Medium–High |
| F-09 | XFF IP ban evasion/framing | Medium | Yes / mod for framing | No | If proxy misconfigured | Yes | High mechanism |
| F-10 | Exposed DB/Rabbit/Adminer ports | Medium (deployment) | Network | No | Depends on firewall | Depends | Medium |
| F-11 | Whisper fan-out abuse | Low–Medium | Yes | No | Yes | Yes | High mechanism |
| F-12 | Chat token DoS | Low | Yes | No | Yes | Yes | Low–Medium |
| F-13 | UUID uppercase corruption | Low | Yes | No | Yes | Yes | High |
| F-14 | Nil deref / test operator | Low | Yes | No | Yes | Yes | High |
| F-15 | Self-demotion inconsistency | Low | Yes (mod) | No | Yes | Yes | High |
| F-16 | Dependency risk | Low / info | Varies | Varies | Version present | Version present | Version-confirmed |
| F-17 | Missing headers / localStorage | Low | No | No | Yes | Yes | High |
| F-18 | PTT hot mic | Low (privacy) | No | No | Desktop build | Desktop build | High |

---

## 8. Remediation Roadmap

### P0 — Stop active exploitation paths

1. **Fix room authorization (F-01).**
   - Pass the target room explicitly; require `caller.currentRoomId == target.currentRoomId`.
   - Check the caller's role in that room.
   - Scope `set_owner` to the managed room, not all rooms by `creatorId`.
   - Add negative tests for cross-room `set_auth`/`set_role`/`set_owner`.

2. **Fix message deletion (F-02).**
   - Store messages with author/room; load and verify on delete.
   - Ignore client `userId` as authority.
   - Add deletion rate limits and audit logs.
   - Fix the mod/creator guard to compare the message author.

3. **Revoke sessions on ban (F-03).**
   - Increment `tokenVersion`; close active sockets; check `reasonForBan` on every auth path.
   - Add a server-side logout/revocation endpoint; rotate refresh tokens.

4. **Disable `/dev/test-info` (F-04).**
   - Remove from staging/production builds; compile only for isolated local dev.
   - Restrict CORS; rotate staging secrets and sessions.

5. **Remove `redirect_after_base` (F-05).**
   - Allowlist redirect URIs; random cookie-bound `state`; one-time code/token exchange; no tokens in query strings.

### P1 — Reduce blast radius

6. **Harden OAuth/client token handling (F-06, F-17).**
   - HttpOnly/Secure/SameSite cookies or in-memory tokens; strip URLs; CSP/Referrer-Policy; validate `state`.

7. **Enforce private-room access (F-07).**
   - Invite/ACL or signed join token; hide `currentRoomId` for private rooms; no auto-speaker.

8. **Harden Electron (F-08, F-18).**
   - `nodeIntegration:false`, `contextIsolation:true`, `sandbox:true`.
   - Deny non-app navigation; remove `localhost`/staging from production allowlist; `setWindowOpenHandler`.
   - `allowDowngrade:false`; upgrade Electron/electron-updater; verify signatures.
   - Fix PTT keyup; do not expose `globalkey` to the renderer.

9. **Fix IP trust (F-09).**
   - Trust only proxy-set headers; use `remote_ip`; validate/normalise; rate-limit reconnects; don’t rely on IP bans.

### P2 — Hardening and correctness

10. **Deployment (F-10).** Remove/bind management ports; internal networks; strong secrets; no Adminer in prod.
11. **Chat limits (F-11, F-12).** Cap whisper recipients and token counts; per-recipient throttles; frame-size limits.
12. **Correctness (F-13, F-14, F-15).** Fix `lower/1`, `set_role` field, nil guard, test manifest, self-demotion write.
13. **Dependencies (F-16).** Upgrade EOL packages; remove unused deps; add SCA.
14. **Monitoring.** Add the detections below; retain audit logs for moderation and incident response.

---

## 9. Detection and Monitoring

| Area | Signal | Why |
|---|---|---|
| Room auth | `set_auth`/`set_role` where actor room != target room | F-01 |
| Room auth | `mod_changed`/`new_room_creator` by a non-DB-creator | F-01 |
| Chat | Deletions where deleter != message author; bursts | F-02 |
| Auth | Banned user opens WS or sends operators | F-03 |
| Dev route | Any `/dev/test-info` request outside local dev | F-04 |
| OAuth | Callback redirect not in allowlist; token issued then used from a new ASN | F-05 |
| Tokens | Same token pair from multiple IPs/UAs; query-token page loads | F-06 |
| Private rooms | Joins without invite; `/user/:username` enumeration | F-07 |
| Electron | Navigation/new-window to non-production origins; downgrade updates | F-08 |
| IP | Frequent XFF changes per account; IP bans across ASNs | F-09 |
| Infra | External connections to 5432/5672/15672/8080 | F-10 |
| Chat | Large whisper recipient lists; huge token arrays | F-11/F-12 |
| Errors | UUID validation spikes; `revoke_api_key` crashes; WS restarts | F-13/F-14 |
| Permissions | `isMod` DB vs last broadcast divergence | F-15 |

---

## 10. Non-Findings and False Positives

A deep review must distinguish “present” from “reachable”. The following were reviewed and are **not** reported as vulnerabilities, or are explicitly downgraded.

1. **`room:set_auth` with `:owner` does not transfer the target’s room to the attacker.** The earlier hypothesis was wrong. `set_owner` calls `replace_room_owner(setter_id, user_id)`, which updates the room where `creatorId == setter_id` - the attacker's own room, and the code requires exactly one updated row - not the target's room. On staging it additionally sets the target as runtime creator in the target room, grants the attacker speaker there, and spoofs `new_room_creator`. The impact is real but different: cross-room speaker grant, target runtime-creator/chat state, ownership transfer of the attacker’s own room. F-01 describes the corrected behavior.

2. **No SQL injection found.** The data layer uses Ecto queries and changesets; no raw SQL string interpolation with user input was observed in the reviewed paths.

3. **No direct stored XSS in chat.** Chat tokens are rendered as React children; links are validated to `http`/`https` (`chat_token.ex:48-63`) and rendered with `href`/`rel="noreferrer noopener"`. No `dangerouslySetInnerHTML` was found in the chat renderer. This does not eliminate XSS risk elsewhere, and Electron makes any XSS critical.

4. **`normalize-url` ReDoS is not directly reachable via chat links.** The advisory payload uses `data:` URLs; server-side link validation only allows `http`/`https`. Upgrade anyway.

5. **Next.js image-optimizer advisories are not demonstrated reachable.** `next/image` is unused, `images.domains` is not configured, no upload-to-`public/` path was found, and `src/pages/404.tsx` exists (ruling out the 404 open-redirect advisory). Middleware/rewrites advisories are not applicable because no middleware/rewrites were found. The `/_next/image` endpoint should still be tested/disabled.

6. **`ws` and `jsonwebtoken` advisories are likely unreachable in `shawarma`.** Both packages are dependencies, but no server/verify usage was found in `shawarma/src`. Remove them.

7. **No hardcoded production secrets found.** `releases.exs` reads secrets from environment variables and raises if missing. Local/dev compose credentials are not production secrets. The `??.??` file is a harmless 17-byte emoji file, not a secret.

8. **Voice cross-room injection is blocked.** `dispatch_mediasoup_message` overwrites `peerId`/`uid`/`roomId` with the authenticated user's values; listeners receive only a recv transport, and `@send-track` errors without a send transport. The remaining voice issue is the private-room auto-speaker behavior (F-07), not cross-room injection.

9. **`binary_to_term` on `User-Agent` is test-only.** It is compiled under `Mix.env() == :test` (`broth.ex:17-36`) and is not part of a production release.

10. **`user:ban` is narrowly restricted.** It requires the admin’s `githubId` to equal `BEN_GITHUB_ID`; `user:admin_update` requires `staff == true` or the configured ID. This limits the impact of ordinary account compromise, but not of F-04 impersonation.

11. **User/auth/room encoders exclude sensitive fields.** The `User` encoder does not include email, IP, API keys, or OAuth tokens. `Room` leaks `voiceServerId` (a server index), which is low sensitivity. `GET /user/:username` still leaks `currentRoomId` (F-07).

12. **CORS `*` is not classic credentialed CORS.** Auth uses bearer tokens in `localStorage`, not cookies, so `*` does not let arbitrary sites read authenticated responses via cookies. It does let them read public endpoints and, critically, the staging `/dev/test-info` token response (F-04).

13. **`/room/:id` blocks private rooms.** The leak is via `/user/:username`, not the room route. Both facts are needed for an accurate F-07.

14. **No unauthenticated production RCE confirmed.** The Electron path requires user interaction/XSS or an allowed-host compromise; dependency RCEs were not demonstrated reachable. The production rating remains High, not Critical.

---

## 11. Appendices

### A. Evidence index

| File | Lines | Relevance |
|---|---|---|
| `kousa/lib/kousa/room.ex` | 99-108 | Room bans/IP storage |
| `kousa/lib/kousa/room.ex` | 127-143 | `set_auth` target-room/caller-room confusion |
| `kousa/lib/kousa/room.ex` | 148-161 | `set_owner` cross-room effects |
| `kousa/lib/kousa/room.ex` | 167-186 | `set_mod` |
| `kousa/lib/kousa/room.ex` | 192-227 | `set_user` self/creator paths |
| `kousa/lib/kousa/room.ex` | 239-305 | `set_role` listener/speaker |
| `kousa/lib/kousa/room.ex` | 482-531 | Private join + auto-speaker |
| `kousa/lib/beef/access/rooms.ex` | 16-34 | `get_room_status` uses current room |
| `kousa/lib/beef/access/rooms.ex` | 36-60 | `can_join_room` lacks private check |
| `kousa/lib/beef/mutations/rooms.ex` | 115-125 | `replace_room_owner` by creatorId |
| `kousa/lib/broth/message/room/set_auth.ex` | 12-22 | Client-controlled target userId |
| `kousa/lib/broth/message/room/set_role.ex` | 17-28 | `UUID.normalize(:id)` typo |
| `kousa/lib/kousa/chat.ex` | 51-79 | Deletion authorization |
| `kousa/lib/onion/chat.ex` | 288-310 | Whisper fan-out |
| `kousa/lib/onion/chat.ex` | 321-333 | Blind deletion broadcast |
| `kousa/lib/broth/message/chat/delete.ex` | 9-13, 25-35 | Client-owned userId trust |
| `kousa/lib/kousa/utils/token_utils.ex` | 26-65 | Access/refresh validation |
| `kousa/lib/kousa/auth.ex` | 8-45, 84-87 | Auth path, whisper subscription |
| `kousa/lib/kousa/user.ex` | 11-15, 65-77 | Nil deref; ban path |
| `kousa/lib/kousa/access_token.ex` | 7-8 | 1-hour TTL |
| `kousa/lib/kousa/refresh_token.ex` | 7-8 | 30-day TTL |
| `kousa/lib/broth/routes/dev_only.ex` | 11-51 | Token minting |
| `kousa/lib/broth.ex` | 39, 48-52 | CORS plug, `/dev` forward |
| `kousa/lib/broth/plugs/cors.ex` | 7-15 | `Access-Control-Allow-Origin: *` |
| `kousa/config/releases.exs` | 70 | `IS_STAGING` flag |
| `kousa/lib/broth/routes/github_auth.ex` | 12-38, 50-72, 119-130 | Redirect/token leak |
| `kousa/lib/broth/routes/discord_auth.ex` | 10-20, 44-55, 99-110 | Same |
| `kousa/lib/broth/plugs/redirect.ex` | 4-11 | 302 with URL |
| `kibbeh/src/modules/auth/useSaveTokensFromQueryParams.ts` | 10-35 | URL token import |
| `kibbeh/src/modules/auth/useTokenStore.ts` | 5-6, 24-34 | localStorage |
| `kibbeh/src/shared-hooks/useMainWsHandler.tsx` | 139-145 | Client-only ban handling |
| `kibbeh/next.config.js` | 1-16 | No security headers |
| `kousa/lib/broth/routes/user.ex` | 12-20 | Public user lookup |
| `kousa/lib/beef/schemas/user.ex` | 162-179 | `currentRoomId` encoder |
| `kousa/lib/broth/socket_handler.ex` | 45-48, 303-316 | XFF trust; mediasoup rewrite |
| `kousa/lib/beef/room_blocks.ex` | 14-23 | IP-based block check |
| `baklava/src/electron.ts` | 46-48, 68-95, 139-163, 201-212 | Node integration, navigation, updater |
| `baklava/src/constants.ts` | 22-32 | Allowed hosts |
| `baklava/src/utils/overlay/index.ts` | 5-17 | Overlay Node integration |
| `baklava/src/utils/keybinds.ts` | 123-140 | PTT keyup empty |
| `kibbeh/src/modules/keyboard-shortcuts/KeybindListener.tsx` | 56-60 | PTT mute mapping |
| `globalkey/src/lib.rs` | 12-43 | Global key polling |
| `docker-compose.yml` | 19-29, 50-68 | Published ports |
| `docker-compose.prod.yml` | 10-25 | No port removal |
| `kousa/lib/broth/message/chat/send.ex` | 14, 50-123 | Whisper list/token array |
| `kousa/lib/broth/message/_types/chat_token.ex` | 31-37 | Empty token allowance |
| `kousa/lib/kousa/utils/uuid.ex` | 32 | Uppercase bug |
| `kousa/lib/broth/message/manifest.ex` | 9 | Test module in manifest |

### B. Dependency advisory details

OSV queries were run against the exact versions in the repository. Counts and IDs are point-in-time.

| Package | Version | Advisory IDs / notes |
|---|---|---|
| `next` | 10.2.0 | 17 advisories: GHSA-2464-fhr4-w9xw, GHSA-25mp-g6fv-mqxx, GHSA-2xp9-vwfh-vxw4, GHSA-3x4c-7xq6-9pq8, GHSA-4342-x723-ch2f, GHSA-7gfc-8cq8-jh5f, GHSA-9g9p-9gw9-jx7f, GHSA-9gr3-7897-pp7m, GHSA-c59h-r6p8-q9wc, GHSA-fmvm-x8mv-47mj, GHSA-g5qg-72qw-gw5v, GHSA-g77x-44xx-532m, GHSA-ggv3-7p47-pfv8, GHSA-h64f-5h5j-jqjh, GHSA-qpjv-v59x-3qc4, GHSA-vxf5-wxwp-m7g9, GHSA-xv57-4mr9-wg8v |
| `electron` | 12.0.2 | 55 advisories; EOL. Upgrade rather than chasing individual IDs. |
| `electron-updater` | 4.3.8 | GHSA-9jxc-qjr9-vjxq (Windows code-signing bypass; requires compromised manifest/MITM/XSS). |
| `ws` | 7.4.4 | GHSA-3h5v-q93c-6h6q, GHSA-6fc8-4gx4-v693, GHSA-96hv-2xvq-fx4p; no server usage found in `shawarma/src`. |
| `jsonwebtoken` | 8.5.1 | GHSA-8cf7-32gw-wr33, GHSA-hjrf-2m68-5959, GHSA-qwph-4952-7xr6; no usage found in `shawarma/src`. |
| `normalize-url` | 4.5.0 | GHSA-px4h-xg32-q955 (ReDoS for `data:` URLs; not directly reachable via http(s)-validated chat links). |

### C. Protocol notes

- Auth: `auth:request` with access/refresh tokens; the socket state stores the user.
- Operators are JSON with `op` and `d` (or legacy `p`); the server translates and validates via Ecto changesets.
- Most operators require authentication; `Broth.Message.Cast` defaults `needs_auth: true`.
- `@`-prefixed operators are forwarded to the voice SFU after `peerId`/`uid`/`roomId` are overwritten from the authenticated session.
- Chat messages carry `id`, `tokens`, `from`, `sentAt`, `isWhisper`, `whisperedTo`.
- Room auth levels: `owner`, `mod`, `user`. Room roles: `speaker`, `raised_hand`, `listener`.

### D. Glossary

| Term | Meaning |
|---|---|
| Room creator | User whose `creatorId` matches the room; full room authority |
| Room mod | `room_permissions.isMod = true`; can kick/ban/delete in that room |
| Speaker | `isSpeaker = true`; receives a voice send transport |
| Whisper | Chat message with `whisperedTo` recipient UUIDs; delivered via per-user PubSub |
| SFU | Selective Forwarding Unit (`shawarma`) for voice |
| XFF | `X-Forwarded-For` HTTP header |
| CSRF | Cross-Site Request Forgery |
| RCE | Remote Code Execution |

### E. Responsible disclosure note

The repository is archived and no live testing was performed. If any of these issues are found in a live deployment, the operator should be contacted privately with a reasonable disclosure timeline. Do not use the exploit outlines against systems without written authorization. Rotate credentials and invalidate sessions if staging token minting or OAuth redirect leakage is suspected.

---

**End of report.**


0. Auth with your regular account
1. Send ws message to create bot account with the username you want (you can create up to 100):
```typescript
{ op: "user:create_bot", p: { username: "mybotname" }, ref: "[uuid]", v: "0.2.0" }

// or with Kebab

wrapper.mutation.userCreateBot("username").then((response) => console.log(response));
```
2. You will receive back a message with an api key or error:
```typescript
{ op: "user:create_bot:reply", p: { apiKey: "asdoifjo1jioj1f1f2" }, ref: "[uuid]", v: "0.2.0" }

// Kebab typings
{ apiKey: string; isUsernameTaken: null; error: null; } | { apiKey: null; isUsernameTaken: true; error: null; } | { apiKey: null; isUsernameTaken: null; error: string; }
```
3. Save that api key somewhere safe (I will be adding a UI for this but it doesn't exist atm)
4. Send a POST request to `https://api.dogehouse.tv/bot/auth` with a JSON body `{ apiKey: "asdoifjoqefjo" }` and it will return an `accessToken` and `refreshToken` for that bot account.

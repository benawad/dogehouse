# Authentication

Tokens:

- Refresh token -> lasts 30 days
- Access token -> 1 hour

Websocket connection:

- On initial connection if the client doesn't send an `auth` event with their refresh & access token within 8 seconds the connection will be closed by the server
- If access token is valid, the user id is extracted from the payload and the user is authenticated
- If the access token is invalid, the server will try to refresh both tokens

Refreshing tokens:

- A refresh token is invalid if
    - it is malformed
    - it has expired
    - the token version in the payload is different then what's in the db for that user
- If the refresh token is invalid, they are not authenticated and will need to log in again
- If the refresh token is valid they are considered authenticated and a new refresh & access token is created/sent back to the client with the `new_tokens` event
    
    
Invalidating tokens:

- You can invalidate all refresh tokens for a user by incrementing the token version in the db

![DogeHouse logo](/dogehouse-github.png "DogeHouse")

https://dogehouse.tv/

## Structure

- kousa -> Elixir API
- shawarma -> Voice Server
- kofta -> React frontend
- dinner -> Puppeteer shenanigans

## Setting up

### With Docker

1. Make sure Docker and Docker Compose is installed on your system. For macOS and Windows 10 Home/Pro users, Docker Desktop is fine.
2. Clone the repository, the vhnage working directory with `cd dogehouse`.
3. Copy `docker-compose.example.yml` into `docker-compose.yml` and edit environment variables for the backend server, such as GitHub OAuth app ID and secret, and Sentry DSN (only needed in production).
4. Run `sudo docker-compose up` to make the server alive.
5. Duplicate `kofta/.env.example` into `kofta/.env.production.local` and replace the value of the variable `REACT_APP_API_BASE_URL` pointing into your publicly-accessible Dogehouse API server.
6. To deploy the frontend files in `kofta` directory, run `npm i` followed by `bash ./deploy.sh` to deploy to Netlify. Othetwise, run `npm start` to run the development server.

## Contributions

DogeHouse is open to contributions, but I recommend creating an issue or replying in a comment to let me know what you are working on first that way we don't overwrite each other.

## Investors

If you are interested in investing in DogeHouse or know someone I should talk to, send me an email at benawadapps@gmail.com or dm me on [Twitter](https://twitter.com/benawad).

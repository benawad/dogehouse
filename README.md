![DogeHouse logo](/dogehouse-github.png "DogeHouse")

<p align="center">
  <a href="https://www.youtube.com/watch?v=hy-EhJ_tTQo&t" target="_blank">
    <img src="https://img.shields.io/youtube/likes/hy-EhJ_tTQo?style=for-the-badge" alt="youtube likes" />
  </a>
  <a href="https://discord.gg/wCbKBZF9cV">
    <img src="https://img.shields.io/discord/810571477316403233?style=for-the-badge" alt="discord - users online" />
  </a>
</p>

https://dogehouse.tv/

## Structure
| Codebase    | Description           |
| :---        |    :----:             |
| kousa       | Elixir API            |
| shawarma    | Voice Server          |
| kofta       | React frontend        |
| dinner      | Puppeteer shenanigans |

## Contributions

DogeHouse is open to contributions, but I recommend creating an issue or replying in a comment to let me know what you are working on first that way we don't overwrite each other.

## How to run locally

### Backend

#### RabbitMQ
Install RabbitMQ:
- **macOS**: Run `brew install rabbitmq`
- **Windows**: Run `choco install rabbitmq`
- **Linux**: Follow their installation guide [here](https://www.rabbitmq.com/download.html).

Start RabbitMQ
- **macOS**: Run `brew services start rabbitmq`
- **Windows**: Setup guide [here](https://www.rabbitmq.com/install-windows.html).
- **Linux**: Setup guide [here](https://www.rabbitmq.com/install-debian.html).

#### PostgreSQL
Install PostgreSQL:
- **macOS**: Run `brew install postgresql`
- **Windows**: Follow [this](https://www.postgresqltutorial.com/install-postgresql/) guide.
- **Linux**: Follow [this](https://www.postgresqltutorial.com/install-postgresql-linux/) guide.

Start PostgreSQL:
- **macOS**: Run `brew services start postgresql`
- **Windows**: Start PostgreSQL through the control panel or run `net start postgresql-{version}` 
- **Linux**: Run `/etc/rc.d/init.d/postgresql start`

Create a DB named `kousa_repo2`:

```shell
$ psql postgres

$ CREATE DATABASE kousa_repo2;
```

#### Elixir
Elixir installation guide [here](https://elixir-lang.org/install.html).


#### `kousa`
Navigate to `/kousa` and set the following environment variables:
```
export DATABASE_URL=postgres://user:password@localhost/kousa_repo2
export BEN_GITHUB_ID=7872329
export RABBITMQ_URL=amqp://user:password@yourinternalip:5672
export ACCESS_TOKEN_SECRET=
export REFRESH_TOKEN_SECRET=
export GITHUB_CLIENT_ID=
export TWITTER_API_KEY=
export TWITTER_SECRET_KEY=
export TWITTER_BEARER_TOKEN=
export GITHUB_CLIENT_SECRET=
export SENTRY_DNS=
export API_URL=http://localhost:4001
export WEB_URL=http://localhost:3000
export PORT=4001
```

> You can save this variables in a `.txt` and run `source path/to/file.txt`

Run the following commands:
```shell
$ mix deps.get
$ mix ecto.migrate
```

Start the server
```shell
$ iex -S mix
```

#### `shawarma`
Navigate to `/shawarma` and run `npm i`.

> Mediasoup requires `node >=0.8 <=14` and has [specific requirements](https://mediasoup.org/documentation/v3/mediasoup/installation/#windows) on Windows.

Create an `.env` file and set the following environment variable:

```
WEBRTC_LISTEN_IP=127.0.0.1
```

Then run `npm run build` and `npm start`.

### Frontend

#### `kofta`
Navigate to `/kofta` and create an `.env` file based on `.env.example`.

Run `npm i` and then `npm start`.

## Investors

If you are interested in investing in DogeHouse or know someone I should talk to, send me an email at benawadapps@gmail.com or dm me on [Twitter](https://twitter.com/benawad).

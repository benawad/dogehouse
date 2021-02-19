# Contributing to DogeHouse

We love your input! We want to make contributing to this project as easy and transparent as possible, whether it's:
- Reporting a issue
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## Code of Conduct
The code of conduct is described in [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md)

## Our Development Process
All changes happen through pull requests. Pull requests are the best way to propose changes. We actively welcome your pull requests and invite you to submit pull requests directly <a href="https://github.com/benawad/dogehouse/pulls">here</a> and, after review, these can be merged into the project.

### How Pull Requests Work

1. Fork the repo and create your branch from `staging`.
2. If you've added code that should be tested, add some tests' example.
3. Ensure to describe your pull request.

## Local Development

If you want to try DogeHouse features on your local machine as you code, you can run an local development server by following these steps.

### Back-end

#### RabbitMQ

Install RabbitMQ:
- **macOS**: Run `brew install rabbitmq`
- **Windows**: Run `choco install rabbitmq`
- **Linux**: Follow their installation guide [here](https://www.rabbitmq.com/download.html).

Start RabbitMQ
- **macOS**: Run `brew services start rabbitmq`
- **Windows**: Read the setup guide [here](https://www.rabbitmq.com/install-windows.html).
- **Linux**: Read the setup guide [here](https://www.rabbitmq.com/install-debian.html).

#### PostgreSQL

Install PostgreSQL:
- **macOS**: Run `brew install postgresql`
- **Windows**: Follow [this](https://www.postgresqltutorial.com/install-postgresql/) guide.
- **Linux**: Follow [this](https://www.postgresqltutorial.com/install-postgresql-linux/) guide.

Start PostgreSQL:
- **macOS**: Run `brew services start postgresql`
- **Windows**: Start PostgreSQL through the control panel or run `net start postgresql-{version}` 
- **Linux**: Run `sudo /etc/rc.d/init.d/postgresql start` or `sudo systemctl start postgresql`.

* Create a DB named `kousa_repo2`:

```shell
$ psql postgres

$ CREATE DATABASE kousa_repo2;
```

#### Elixir

Please see the instructions on how to install Elixir [here](https://elixir-lang.org/install.html)..

#### Elxir API server

* Navigate to `/kousa` and set the following environment variables:

```shell
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
export SENTRY_DSN=
export API_URL=http://localhost:4001
export WEB_URL=http://localhost:3000
export PORT=4001
```

> You can save this variables in a `.txt` and run `source path/to/file.txt`

* Run the following commands:
```shell
$ mix deps.get
$ mix ecto.migrate
```

* Start the server

```shell
$ iex -S mix
```

#### Voice Server
* Navigate to `/shawarma` and run `npm i`.

> Mediasoup requires `node >=0.8 <=14` and has [specific requirements](https://mediasoup.org/documentation/v3/mediasoup/installation/#windows) on Windows.

* Create an `.env` file and set the following environment variable:

```
WEBRTC_LISTEN_IP=127.0.0.1
```

* Then run `npm run build` and `npm start`.

### Front-end

#### React Webapp
* Navigate to `/kofta` and create an `.env` file based on `.env.example`.

* Run `npm i` and then `npm start`.

### With Docker

1. Make sure Docker and Docker Compose is installed on your system.
For macOS and Windows 10 Home/Pro users, Docker Desktop is fine.
2. Clone the repository, the chnage working directory with `cd dogehouse`.
3. Copy `docker-compose.example.yml` into `docker-compose.yml` and edit environment
variables for the backend server, such as OAuth app IDs and secrets, and Sentry DSN
(only needed in production).
4. Run `sudo docker-compose up` to make the server alive.
5. Duplicate `kofta/.env.example` into `kofta/.env` and replace the value of the variable `REACT_APP_API_BASE_URL` pointing into your publicly-accessible Dogehouse API server. For local development, leave as-is. 
6. To deploy the frontend files in `kofta` directory, run `npm i` followed by `bash ./deploy.sh` to deploy to Netlify. Othetwise, run `npm start` to run the development server.

## Issues

We use GitHub issues to track public bugs. Please ensure your description is
clear and has sufficient instructions to be able to reproduce the issue. Report a bug by <a href="https://github.com/benawad/dogehouse/issues">opening a new issue</a>; it's that easy!

## Frequently Asked Questions (FAQs) 
<!--- I thought it would be great to have a list of FAQs for the project to help save time for new contributors--->
    - Q: [The Question?]
    - A: [The Answer!]

## Feature Request
Great Feature Requests tend to have:

- A quick idea summary
- What & why you wanted to add the specific feature
- Additional Context like images, links to resources to implement the feature etc etc.

## License
By contributing to DogeHouse, you agree that your contributions will be licensed
under the LICENSE file in the root directory of this source tree.

# Contributing to DogeHouse
> Please read the [PRIORITY LIST](https://github.com/benawad/dogehouse/issues/1969) before contributing.

We love your input! We want to make contributing to this project as easy and transparent as possible, whether it's:
- Reporting an issue
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## Code of Conduct
The code of conduct is described in [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md).

## Our Development Process
All changes happen through pull requests. Pull requests are the best way to propose changes. We actively welcome your pull requests and invite you to submit pull requests directly [here](https://github.com/benawad/dogehouse/pulls), and after review, these can be merged into the project.

## Using the Project's Standard Commit Messages
This project is using the [conventional commits](https://www.conventionalcommits.org/en/v1.0.0-beta.2/) standard. Please follow these steps to ensure your
commit messages are standardized:
1. Make sure your shell path is in the root of the project (not inside any of the packages).
2. Run `yarn`.
3. Stage the files you are commiting with `git add [files]`.
4. Run `yarn commit`. This will start an interactive prompt that generates your commit message:
    1. Select the type of change.
    2. Type the scope. This is either `global` for project-wide changes or one of the packages (kibbeh, shawarma etc.).
    3. Write a short, imperative tense description of the change.
    4. If the above was not sufficient, you may now write a longer description of your change (otherwise press enter to leave blank).
    5. y or n for whether there are any breaking changes (e.g. changing the props of a component, changing the JSON structure of an API response).
    6. y or n for whether this change affects an open issue, if positive you will be prompted to enter the issue number.
5. Your commit message has now been created, you may push to your fork and open a pull request (read below for further instructions).

## Pull Requests
1. Fork the repo and create your branch (usually named `patch-%the number of PRs you've already made%`) from `staging`.
2. If you've added code that should be tested, add some test examples.
3. Ensure to describe your pull request.

## Adding Emojis
Emojis need to be 28x28px. To add an emoji, add the png/gif image to public/emojis and add the emoji to the `kofta/src/app/modules/room-chat/EmoteData.ts`.

To avoid conflicts please add the emojis to the top of the file.
> **NOTE:** We are not accepting new emojis atm


## Quickstart Local Frontend Development
Do this if you only want to do React stuff and don't want to touch Elixir:

### UI *(react + next.js)*:
Navigate to `/kibbeh`

- Run `yarn`
- Run `yarn staging` (this tells React to connect to a hosted version of the backend for development purposes)
- Read `kibbeh/README.md` for more information and a fixes for known development issues.
> **NOTE:** Please follow the [design guidelines](https://github.com/benawad/dogehouse/blob/staging/DESIGN_GUIDELINES.md) and [figma mockups](https://www.figma.com/file/CS01VVLR7ArQl0afYFkNj3/Web-App) and if what you're trying to do isn't in there, consult [@ajmnz](https://github.com/ajmnz)/[@benawad](https://github.com/benawad) beforehand.

## Translating
1. Set up the front-end (previous step).
2. Go to `kibbeh/public/locales`.
3. Check if a folder with the language you want to add / edit already exists. If not, copy `en/translation`, create the folder and paste it there.
4. Edit the JSON file. Make sure that it's valid.
5. Go to `kibbeh/src/ui/LanguageSelector.tsx` and edit the object to include your language.
6. Test and make a pull request.

## Supporting translation in new components
1. Add your translation key into the English `translation.json` located in `kibbeh/public/locales/en/translation.json`. Make sure it is put in an appropriate section that makes sense.
2. Run `yarn gen:i18:keys`. This will add your key into `translationKeys.ts`.
3. Use your translation key in your code. This is done by using `useTypeSafeTranslation` like this: `const { t } = useTypeSafeTranslation();`. You can now call `t` and get your desired translation key.
4. Run `yarn i18` to generate all fields into all other `translation.json`.

## Devcontainer Full Local Development
For VSCode users, we're able to use devcontainers which allows to create development environments that already have all the tools and services configured and ready to go.

### Usage

_Prerequisite: [Install Docker](https://docs.docker.com/install) on your local environment._

To get started, read and follow the instructions in [Developing inside a Container](https://code.visualstudio.com/docs/remote/containers). The [.devcontainer/](./.devcontainer) directory contains pre-configured `devcontainer.json`, `docker-compose.yml` and `Dockerfile` files, which you can use to set up remote development within a docker container.

- Install the [Remote - Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) extension.
- Open VSCode and bring up the [Command Palette](https://code.visualstudio.com/docs/getstarted/userinterface#_command-palette).
- Type `Remote-Containers: Open Folder in Container`, this will build the container with Elixir and Node installed, this will also start Postgres and RabbitMQ instances.

> If you need to modify environment variables for kousa, you need to modify them inside `/home/doge/.bashrc` and restart your terminal.

### Run
#### `kousa`
```shell
$ mix deps.get
$ mix ecto.migrate
$ iex -S mix
```
#### `shawarma`
```shell
$ yarn
$ yarn build
$ yarn start
```
#### `kibbeh`
```shell
$ yarn
$ yarn dev
```

## Manual Full Local Development
How to run locally:

### Backend
#### RabbitMQ
Install RabbitMQ:
- **macOS**: Run `brew install rabbitmq`.
- **Windows**: Run `choco install rabbitmq`.
- **Linux**: Follow their installation guide [here](https://www.rabbitmq.com/download.html).

Start RabbitMQ
- **macOS**: Run `brew services start rabbitmq`.
- **Windows**: Setup guide [here](https://www.rabbitmq.com/install-windows.html).
- **Linux**: Setup guide [here](https://www.rabbitmq.com/install-debian.html).

#### PostgreSQL
Install PostgreSQL:
- **macOS**: Run `brew install postgresql`.
- **Windows**: Follow [this](https://www.postgresqltutorial.com/install-postgresql/) guide.
- **Linux**: Follow [this](https://www.postgresqltutorial.com/install-postgresql-linux/) guide.

Start PostgreSQL:
- **macOS**: Run `brew services start postgresql`.
- **Windows**: Start PostgreSQL through the control panel or run `net start postgresql-{version}`.
- **Linux**: Run `/etc/rc.d/init.d/postgresql start`.

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
export DISCORD_CLIENT_ID=
export DISCORD_CLIENT_SECRET=
```

> You can save these variables in a `.txt` and run `source path/to/file.txt`

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
Navigate to `/shawarma` and run `yarn`.

> Mediasoup requires `node >=0.8 <=14` and has [specific requirements](https://mediasoup.org/documentation/v3/mediasoup/installation/#windows) on Windows.

Create an `.env` file and set the following environment variable:

```
WEBRTC_LISTEN_IP=127.0.0.1
```

Then run `yarn build` and `yarn start`.

## Issues
We use GitHub issues to track public bugs. Please ensure your description is
clear and has sufficient instructions to be able to reproduce the issue. Report a bug by <a href="https://github.com/benawad/dogehouse/issues">opening a new issue</a>; it's that easy!

## Frequently Asked Questions (FAQs)
<!--- I thought it would be great to have a list of FAQs for the project to help save time for new contributors--->
    - Q: [The Question?]
    - A: [The Answer!]

## Feature Request
Great Feature Requests tend to have:

- A quick idea summary.
- What & why you wanted to add the specific feature.
- Additional context like images, links to resources to implement the feature etc, etc.

## License
By contributing to DogeHouse, you agree that your contributions will be licensed
under the [LICENSE file](LICENSE).

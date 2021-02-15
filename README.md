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

- kousa -> Elixir API
- shawarma -> Voice Server
- kofta -> React frontend
- dinner -> Puppeteer shenanigans

## Contributions

DogeHouse is open to contributions, but I recommend creating an issue or replying in a comment to let me know what you are working on first that way we don't overwrite each other.

## How to run locally

### backend

0. Install and start RabbitMQ
1. Install and start Postgresql
2. Create a DB inside Postgresql called `kousa_repo2`
3. Install Elixir
4. Inside `kousa` 
- run `mix deps.get`
- run `mix ecto.migrate`
- run `iex -S mix` (This starts the server, read all the error messages and add those environment variables)
5. 

## Investors

If you are interested in investing in DogeHouse or know someone I should talk to, send me an email at benawadapps@gmail.com or dm me on [Twitter](https://twitter.com/benawad).

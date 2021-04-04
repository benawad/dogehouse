<a href="https://dogehouse.tv"><p align="center">
<img height=100 src="https://raw.githubusercontent.com/benawad/dogehouse/staging/.redesign-assets/dogehouse_logo.svg"/>

</p></a>
<p align="center">
  <strong>Taking voice conversations to the moon 🚀</strong>
</p>
<p align="center">
  <a href="https://discord.gg/wCbKBZF9cV">
    <img src="https://img.shields.io/discord/810571477316403233?style=for-the-badge" alt="discord - users online" />
  </a>
  <a href="https://dogehouse.tv">
    <img src="https://img.shields.io/endpoint?color=FD4D4D&style=for-the-badge&url=https%3A%2F%2Fapi.dogehouse.xyz%2Fv1%2Fshields" alt="dogehouse - users online" />
  </a>
</p>

<h3 align="center">
  <a href="https://github.com/benawad/dogehouse/blob/staging/CONTRIBUTING.md">Contribute</a>
  <span> · </span>
  <a href="https://discord.gg/82HzQCJCDg">Community</a>
  <span> · </span>
  <a href="./docs/README.MD">Documentation</a>
</h3>

<p align="center"><b>https://dogehouse.tv/</b></p>

---

## Structure

| Codebase             |      Description      |
| :------------------- | :-------------------: |
| [kousa](kousa)       |      Elixir API       |
| [shawarma](shawarma) |     Voice Server      |
| [kofta](kofta)       |    React frontend     |
| [dinner](dinner)     | Puppeteer shenanigans |
| [baklava](baklava)   |   Electron Wrapper    |
| [pilaf](pilaf)       |   React Native App    |
| [feta](feta)         | Shared utils web/app  |
| [kibbeh](kibbeh)     |   Next.js frontend    |
| [kebab](kebab)       |      API Client       |

## Branches

- staging -> pr this branch for everything else
- prod -> don't touch, this is what's running in prod

## Contributions

DogeHouse is open to contributions, but I recommend creating an issue or replying in a comment to let me know what you are working on first that way we don't overwrite each other.

Please read [CONTRIBUTING.md](https://github.com/benawad/dogehouse/blob/staging/CONTRIBUTING.md) for details on this project.

## DogeHouse Desktop

A desktop app built with [electron](https://www.electronjs.org/) is available for Windows, Mac, and Linux

Download links are in [the releases section](https://github.com/benawad/dogehouse/releases/latest)

Dogehouse is also available in the AUR

```bash
yay -S dogehouse
```

And in an Ubuntu ppa

```bash
echo "deb http://ppa.dogehouse.tv/ ./" | sudo tee -a /etc/apt/sources.list > /dev/null
wget -q -O - http://ppa.dogehouse.tv/KEY.gpg | sudo apt-key add -
sudo apt-get update
sudo apt-get install dogehouse
```

**_Notes:_**

- If a warning message pops up on Windows, go to 'more info' and select 'Run Anyway'

## DogeReviewers

Contributors helping to review/merge pull requests:

- [@ermalsh](https://github.com/ermalsh)
- [@ofsho](https://github.com/ofsho)
- [@HarrisonMayotte](https://github.com/HarrisonMayotte)
- [@nadirabbas](https://github.com/nadirabbas)
- [@overlisted](https://github.com/overlisted)
- [@goldyydev](https://github.com/goldyydev)
- [@jamesql](https://github.com/jamesql)
- [@amitojsingh366](https://github.com/amitojsingh366)

## Code of Conduct

Please read [CODE_OF_CONDUCT.md](https://github.com/benawad/dogehouse/blob/staging/CODE_OF_CONDUCT.md) for details on our code of conduct.

## How to run locally

Check <a href="https://github.com/benawad/dogehouse/blob/staging/CONTRIBUTING.md#quickstart-local-frontend-development">here</a> on how to run locally</a>

## Why did you make this?

https://www.youtube.com/watch?v=hy-EhJ_tTQo

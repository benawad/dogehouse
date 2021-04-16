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

<h4 align="center">
  <a href="https://dogehouse.tv">DogeHouse</a>
  <span> · </span>
  <a href="https://next.dogehouse.tv">Beta</a>
</h4>

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

- staging -> pr this branch for everything
- prod -> don't touch, this is what's running in prod

## Contributions

DogeHouse is open to contributions, but I recommend creating an issue or replying in a comment to let me know what you are working on first that way we don't overwrite each other.

Please read [CONTRIBUTING.md](https://github.com/benawad/dogehouse/blob/staging/CONTRIBUTING.md) for details on this project.

## DogeHouse Desktop

A desktop app built with [Electron](https://www.electronjs.org/) is available for Windows, Mac, and Linux.

There are different ways to get the Electron desktop app:

* Get the official builds from [here, in GitHub Releases][gh-releases]
for any platform.
* Get it from AUR for Arch/Manjaro with `yay -S dogehouse`.
* Get the desktop client for Debian-based distros (including Ubuntu)
from the official APT repo with these simple steps:
  * Add the repo with `echo "deb http://ppa.dogehouse.tv/ ./" | sudo tee -a /etc/apt/sources.list > /dev/null`
  * Add Ben Awad's GPG key with `$(command -v curl>>/dev/null && echo "curl -o-" || echo "wget -q0-") http://ppa.dogehouse.tv/KEY.gpg | sudo apt-key add -`.
  * Finally, update your local repoistory list and install DogeHouse
with `sudo apt update && sudo apt install dogehouse`.
* Get the snap for your systemd-powered Linux distro from either the
[Snap Store](https://snapcraft.io/dogehouse) or in an terminal with
`sudo snap install dogehouse`.
  * After installing the snap, you need to allow microphone access with
`sudo snap connect dogehouse:audio-record` to be able to speak in rooms.

[gh-releases]: https://github.com/benawad/dogehouse/releases

**_Notes:_**

- If a warning message pops up on Windows, go to 'more info' and select 'Run Anyway'
- Currently, the snap package's available channels are only `edge` as
contributions for Baklava are merged almost on daily basis. Tested
versions that are stable will be promoted into `stable` in the future.

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

## Attribution

We use https://twemoji.twitter.com/

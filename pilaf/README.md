<p align="center">
    <img height=100 src="https://raw.githubusercontent.com/benawad/dogehouse/staging/.redesign-assets/dogehouse_logo.svg"/>
</p>

<p align="center">
    <strong>Taking voice conversations to the moon 🚀</strong>
</p>

<p align="center">
    <img src="https://img.shields.io/github/contributors/benawad/dogehouse"/>
    <img src="https://img.shields.io/discord/810571477316403233?label=discord"/>
    <img src="https://img.shields.io/github/v/release/benawad/dogehouse"/>
</p>
<br/>

# What is this folder?

This folder is pilaf ([pi·laf](https://en.wikipedia.org/wiki/Pilaf)) and it contains everything related to the [React Native](https://reactnative.dev/) app.

# How can I contribute?

First of all, this project is currently in _very_ early stages of development, therefore these instructions may not be up to date.

**We're using [Yarn](https://yarnpkg.com/) for this project, do not use npm for the following commands**

Compile @dogehouse/kebab by executing the following commands:

```bash
cd ../kebab
yarn
yarn build
```

After you successfully compiled Kebab, go back to this directory and install all modules (@dogehouse/kebab is a yarn workspace, you do <u>not</u> need to manually copy it to node_modules)

You should now be all set to go, go ahead and run the dev server

```bash
cd ../pilaf
yarn
yarn start
```

You now have a metro bundler running, you can start the app on Android or iOS

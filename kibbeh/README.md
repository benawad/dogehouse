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

This folder is called kibbeh ([/ˈkɪbi/](https://en.wikipedia.org/wiki/Kibbeh)), it is currently used for our Next.js frontend.

It's live on 👉 [dogehouse.tv](https://dogehouse.tv)

# How can I contribute?

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
cd ../kibbeh
yarn
yarn staging
```

> If for some reason the above commands dont work and leave you with a `@dogehouse/kebab` module not found error, just copy the entire `dogehouse/kebab` directory over to `dogehouse/node_modules/@dogehouse/kebab`

> **NOTE:** OAuth login is kinda broken as of right now *(if running using `yarn staging`)* so to get around it follow the steps below:
> - Enter your credentials in OAuth
> - You should now reach a page saying `not found`. Copy the url of the page
> - Edit the previously copied URL and change the protocol from `https` to `http` and the hostname from `doge-staging.stripcode.dev` to `localhost:3000`. For example: `https://doge-staging.stripcode.dev/?accessToken=YOUR_TOKEN_HERE` would be changed to  `http://localhost:3000/?accessToken=YOUR_TOKEN_HERE`
> - You should now be logged in.  

> Also to prevent repeating the steps mentioned above, instead of logging in just directly go to `http://localhost:3000/dash` and it should read your tokens from localstorage and log you in

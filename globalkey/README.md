[![npm](https://img.shields.io/npm/v/globalkey)](https://www.npmjs.com/package/globalkey) ![downloads](https://img.shields.io/npm/dm/globalkey)

# GlobalKey

## Building

```shell
cargo install nj-cli

nj-cli build --release
```

## Calling from node

```shell
npm i globalkey

# or

yarn add globalkey
```

```node
const globalkey = require('globalkey');

globalkey
    .start(x => console.log(`Keydown ${x}`), y => console.log(`Keyup ${y}`));


setTimeout(() => globalkey.stop(), 5000)
```

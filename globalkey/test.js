const globalkey = require('./dist');

globalkey
    .start(x => console.log(`Keydown ${x}`), y => console.log(`Keyup ${y}`));


setTimeout(() => globalkey.stop(), 5000)

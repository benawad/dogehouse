<h1 align=center>
Dolma Token Transcoder<br>
<a href="https://www.npmjs.com/package/@dogehouse/dolma"><img src="https://img.shields.io/npm/v/@dogehouse/dolma?style=for-the-badge"></a>
</h1>
This is a token transcoder that is used to encode and decode DogeHouse chat message token arrays.  This package is written for bot/bot library developers to be able to easily transcode dogehouse chat message tokens.  

## How to install

To install this, simply go to your project and run the following command:

```cmd
yarn add dolma
```

## How to use

This will show you how to encode and decode tokens

### Encoding Tokens

In this example, you will see multiple ways to encode your tokens. The first one is in plain text. You can pass any string into the encoder and it will convert it into an array of Message Tokens.

```ts
import { dolma } from "dolma";

const str = "I'm @HoloPanio, and I'd like to goto `Paris, France` one day :catJAM: Also, https://dogehouse.tv is epic!";

const tokens = dolma.encode(str);

console.log(tokens);

/**
Returns: 
[
  { t: 'text', v: "I'm" },
  { t: 'mention', v: 'HoloPanio' },
  { t: 'text', v: ',' },
  { t: 'text', v: 'and' },
  { t: 'text', v: "I'd" },
  { t: 'text', v: 'like' },
  { t: 'text', v: 'to' },
  { t: 'text', v: 'goto' },
  { t: 'block', v: 'Paris, France' },
  { t: 'text', v: 'one' },
  { t: 'text', v: 'day' },
  { t: 'emote', v: 'catJAM' },
  { t: 'text', v: 'Also,' },
  { t: 'link', v: 'https://dogehouse.tv' },
  { t: 'text', v: 'is' },
  { t: 'text', v: 'epic!' }
]
*/
```

In this example, you will see that you can have a mixed array with strings, and unitokens!  A unitoken is a token object where you define your object key as the token type, and the value as the value of the token, doing so would look like such: `{link: "https://google.com"}`, and this can be done for all token types.

```ts
import { dolma } from 'dolma';
const arr = ["I'm", {mention: "HoloPanio"},", and I'd like to goto", {block: "Paris, France"},"one day", {emote: "catJAM"}, "Also",{link: 'https://dogehouse.tv'}, "is epic!"];

const tokens = dolma.encode(arr);

console.log(tokens);

/**
Returns: 
[
  { t: 'text', v: "I'm" },
  { t: 'mention', v: 'HoloPanio' },
  { t: 'text', v: ',' },
  { t: 'text', v: 'and' },
  { t: 'text', v: "I'd" },
  { t: 'text', v: 'like' },
  { t: 'text', v: 'to' },
  { t: 'text', v: 'goto' },
  { t: 'block', v: 'Paris, France' },
  { t: 'text', v: 'one' },
  { t: 'text', v: 'day' },
  { t: 'emote', v: 'catJAM' },
  { t: 'text', v: 'Also,' },
  { t: 'link', v: 'https://dogehouse.tv' },
  { t: 'text', v: 'is' },
  { t: 'text', v: 'epic!' }
]
*/
```
You can also pass in message tokens like `{t: 'link', v: 'https://dogehouse.tv'}`, and it will work because the encoder checks for all possible methods that can be used.

### Decoding Tokens

When you get a payload from DogeHouse, you can use the decode method which will take the tokens, and turn it into a raw text string when you can use anywhere you please. The decode method will always encode the data sent to it to ensure that the data is parsed correctly, so that means you can also pass in un-encoded data, such as the array in the previous example, and will print out a plain text string. In this example, we will take the array from above, and return it to a plain text string using the decode method.

```ts
import { dolma } from "dolma";

const tokens = [
  { t: 'text', v: "I'm" },
  { t: 'mention', v: 'HoloPanio' },
  { t: 'text', v: ',' },
  { t: 'text', v: 'and' },
  { t: 'text', v: "I'd" },
  { t: 'text', v: 'like' },
  { t: 'text', v: 'to' },
  { t: 'text', v: 'goto' },
  { t: 'block', v: 'Paris, France' },
  { t: 'text', v: 'one' },
  { t: 'text', v: 'day' },
  { t: 'emote', v: 'catJAM' },
  { t: 'text', v: 'Also,' },
  { t: 'link', v: 'https://dogehouse.tv' },
  { t: 'text', v: 'is' },
  { t: 'text', v: 'epic!' }

];

const message = dolma.decode(tokens);

console.log(message);

/**
Returns: 

I'm @HoloPanio , and I'd like to goto `Paris, France` one day :catJAM: Also, https://google.com is epic!
*/
```
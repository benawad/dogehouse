import "styles/globals.css";
import Head from "next/head";

const App = ({ Component, pageProps }) => <>
  <Head>
    <title>DogeHouse</title>
    <meta name="description" content="Taking voice conversations to the moon 🚀️" />
  </Head>
  <Component {...pageProps} />
</>;

export default App;

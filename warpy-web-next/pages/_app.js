import * as React from "react";
import Head from "next/head";
import "./global.css";
import {StoreProvider} from '../modules/store';

function MyApp({ Component, pageProps }) {
  //const store = useHydrate(pageProps.initialStore);

  return (
    <StoreProvider data={pageProps.initialStore}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta
          name="viewport"
          content="initial-scale=1, viewport-fit=cover, width=device-width"
        ></meta>
        <meta name="apple-mobile-web-app-capable" content="yes"></meta>
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        ></meta>
      </Head>
      <Component {...pageProps} />
    </StoreProvider>
  );
}

export default MyApp;

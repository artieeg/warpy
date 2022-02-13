import "tailwindcss/tailwind.css";

import * as React from "react";
import Head from "next/head";
import "./global.css";
import { config } from "../config";
import { StoreProvider } from "../modules/store";

function AppWrapper(props) {
  const { title, description } = props.pageProps;

  return (
    <>
      <Head>
        <title>{title ?? "warpy"}</title>

        <link rel="shortcut icon" href="/favicon.png" />

        <meta name="og:title" content={title} />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />

        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no"
        />
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes"></meta>
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        ></meta>
      </Head>

      {config.isBrowser && <MyApp {...props} />}
    </>
  );
}

function MyApp({ Component, pageProps }) {
  //const store = useHydrate(pageProps.initialStore);

  return (
    <StoreProvider data={pageProps.initialStore}>
      <Component {...pageProps} />
    </StoreProvider>
  );
}

export default AppWrapper;

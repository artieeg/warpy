import React, { useLayoutEffect } from "react";
import { View, StyleSheet } from "react-native";
import { NextPageContext } from "next";
import Head from "next/head";
import { runNATSRequest } from "../../modules/comms";
import { IStream } from "@warpy/lib";
import { IStore } from "@warpy/store";

type StreamProps = {
  stream: IStream;
  store: IStore;
};

export default function Stream({ store }: StreamProps) {
  return (
    <View style={styles.wrapper}>
      <Head>
        <title>{store.title}</title>
      </Head>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    height: "100%",
    backgroundColor: "#000",
  },
});

export async function getServerSideProps(context: NextPageContext) {
  const { stream } = await runNATSRequest("stream.get", {
    stream: context.query.id,
  });

  const store: Partial<IStore> = {
    title: stream.title,
  };

  return {
    props: {
      store,
    },
  };
}

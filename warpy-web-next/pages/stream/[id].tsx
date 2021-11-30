import React, { useLayoutEffect } from "react";
import { View, StyleSheet } from "react-native";
import { NextPageContext } from "next";
import Head from "next/head";
import { runNATSRequest } from "../../modules/comms";
import { IStream } from "@warpy/lib";
import { IStore } from "@warpy/store";
import { useStore, useStoreShallow } from "../../modules/store";
import { StreamContent } from "../../modules/stream/content";

type StreamProps = {
  stream: IStream;
  initialStore: IStore;
};

export default function Stream({ initialStore }: StreamProps) {
  const { title } = initialStore;

  return (
    <View style={styles.wrapper}>
      <Head>
        <title>{title}</title>
      </Head>
      {typeof window !== "undefined" && <StreamContent />}
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
    stream: stream.id,
    title: stream.title,
  };

  return {
    props: {
      initialStore: store,
    },
  };
}

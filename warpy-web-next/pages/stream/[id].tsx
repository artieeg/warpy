import React from "react";
import { View, StyleSheet } from "react-native";
import { NextPageContext } from "next";
import Head from "next/head";
import { runNATSRequest } from "../../modules/comms";
import { IStore } from "@warpy/store";
import { StreamContent } from "../../modules/stream/content";

type StreamProps = {
  rid: string;
  initialStore: IStore;
};

export default function Stream({ initialStore, rid }: StreamProps) {
  const { title } = initialStore;

  return (
    <View style={styles.wrapper}>
      <Head>
        <title>{title}</title>
      </Head>

      {typeof window !== "undefined" && <StreamContent rid={rid} />}
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
  const { id: streamId, rid } = context.query;

  const { stream } = await runNATSRequest("stream.get", {
    stream: streamId,
  });

  const store: Partial<IStore> = {
    stream: stream.id,
    title: stream.title,
  };

  return {
    props: {
      initialStore: store,
      rid,
    } as StreamProps,
  };
}

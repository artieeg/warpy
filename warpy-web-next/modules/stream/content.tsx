import React, {
  createRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { View, StyleSheet, useWindowDimensions } from "react-native";
import { useStore, useStoreApi, useStoreShallow } from "../store";
import { Text, TextButton } from "@warpy/components";
import Link from "next/link";
import Router from "next/dist/client/router";

type ContentProps = {
  id: string;
  rid: string;
};

export const StreamContent = ({ rid, id }: ContentProps) => {
  const [streamers, dispatchStreamJoin, mediaClient] = useStore((state) => [
    state.streamers,
    state.dispatchStreamJoin,
    state.mediaClient,
  ]);

  console.log({ mediaClient });

  useEffect(() => {
    setTimeout(() => {
      dispatchStreamJoin(id);
    }, 1000);
  }, [id]);

  const streams = useMemo(
    () =>
      Object.values(streamers)
        .map((p) => {
          if (p.media?.video?.active) {
            return p.media?.video?.track;
          } else {
            return undefined;
          }
        })
        .filter((s) => !!s) as any,
    [streamers]
  );

  const videoViewRefs = useMemo(
    () => [
      createRef<any>(),
      createRef<any>(),
      createRef<any>(),
      createRef<any>(),
    ],
    []
  );

  useEffect(() => {
    streams.forEach((stream: any, index: number) => {
      videoViewRefs[index].current.srcObject = stream;
    });
  }, [streams]);

  const { width, height } = useWindowDimensions();

  const mediaStyle = {
    width: streams.length > 2 ? width / 2 : width,
    height: streams.length > 1 ? height / 2 : height,
  };

  const fullWidthMediaStyle = { ...mediaStyle, width };

  const mediaStyles = [
    [mediaStyle],
    [mediaStyle, mediaStyle],
    [mediaStyle, mediaStyle, fullWidthMediaStyle],
  ];

  //const router = useRouter();

  const onOpenInvite = useCallback(() => {
    Router.push(`/invite/${rid}`);
  }, [rid]);

  return (
    <View style={styles.body}>
      {streams.map((_: any, index: any) => (
        <video
          className="video"
          style={{
            ...mediaStyles[streams.length - 1][index],
            zIndex: -1,
          }}
          ref={videoViewRefs[index]}
          autoPlay
          playsInline
          muted
          controls={false}
        />
      ))}
      <TextButton
        onPress={onOpenInvite}
        style={styles.button}
        title="get the app & join"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  button: {
    zIndex: 1,
    position: "absolute",
    bottom: 30,
    left: 30,
    right: 30,
  },
});

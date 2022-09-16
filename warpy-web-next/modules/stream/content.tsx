import React, { createRef, useCallback, useEffect, useMemo } from "react";
import { View, StyleSheet, useWindowDimensions } from "react-native";
import { useStore } from "../store";
import { TextButton } from "@warpy/components";
import Router from "next/dist/client/router";
import { useDispatcher } from "@warpy/store";
import shallow from "zustand/shallow";

type ContentProps = {
  id: string;
  rid: string;
};

export const StreamContent = ({ rid, id }: ContentProps) => {
  //const streamers = [];
  const videoStreams = useStore((state) => state.videoStreams, shallow);
  const dispatch = useDispatcher();

  useEffect(() => {
    setTimeout(() => {
      dispatch(({ stream }) => stream.join({ stream: id }));
    }, 1000);
  }, [id]);

  const streams = useMemo(
    () => Object.values(videoStreams).map((v) => v.stream),
    [videoStreams]
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

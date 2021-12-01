import React, { createRef, useEffect, useMemo, useRef, useState } from "react";
import { View, StyleSheet, useWindowDimensions } from "react-native";
import { useStore, useStoreApi, useStoreShallow } from "../store";
import { Text, TextButton } from "@warpy/components";

export const StreamContent = () => {
  const streamers = useStore((state) => state.streamers);

  const [title, id, dispatchStreamJoin, totalParticipantCount] = useStore(
    (state) => [
      state.title,
      state.stream,
      state.dispatchStreamJoin,
      state.totalParticipantCount,
    ]
  );

  useEffect(() => {
    setTimeout(() => {
      dispatchStreamJoin(id);
    }, 800);
  }, [id]);

  console.log({ totalParticipantCount });

  const videoStreams = useMemo(
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

  const ref = createRef<any>();

  useEffect(() => {
    if (videoStreams.length > 0) {
      console.log(videoStreams[0]);
      ref.current.srcObject = videoStreams[0];
    }
  }, [videoStreams]);

  const { width, height } = useWindowDimensions();

  return (
    <View style={styles.body}>
      <video
        className="video"
        style={{
          width,
          height,
          position: "absolute",
          left: 0,
          top: 0,
          zIndex: -1,
        }}
        ref={ref}
        autoPlay
        playsInline
        muted
        controls={false}
      />
      <TextButton style={styles.button} title="get the app & join" />
    </View>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
  },
  button: {
    zIndex: 1,
    position: "absolute",
    bottom: 30,
    left: 30,
    right: 30,
  },
});

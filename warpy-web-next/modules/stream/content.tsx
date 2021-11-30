import React, { createRef, useEffect, useMemo, useRef } from "react";
import { View, StyleSheet } from "react-native";
import { useStore, useStoreShallow } from "../store";
import { Text } from "@warpy/components";

export const StreamContent = () => {
  const [title, id, dispatchStreamJoin, count] = useStoreShallow((state) => [
    state.title,
    state.stream,
    state.dispatchStreamJoin,
    state.totalParticipantCount,
  ]);

  const streamers = useStore((state) => state.streamers);

  console.log({ count });

  useEffect(() => {
    setTimeout(() => {
      dispatchStreamJoin(id);
    }, 3000);
  }, [id]);

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
    console.log({ videoStreams });
    if (videoStreams.length > 0) {
      ref.current.srcObject = videoStreams[0];
    }
  }, [videoStreams]);

  return (
    <View>
      <Text>{title}</Text>
      <video ref={ref} autoPlay playsInline muted controls={false} />
    </View>
  );
};

const styles = StyleSheet.create({});

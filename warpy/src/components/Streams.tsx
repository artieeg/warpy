import {StyleSheet, useWindowDimensions, View} from 'react-native';
import {useVideoStreams} from '@app/hooks/useVideoStreams';
import React from 'react';
import {RTCView} from 'react-native-webrtc';

interface IStreamsProps {
  forceLocalStream?: boolean;
}

export const Streams = ({forceLocalStream}: IStreamsProps) => {
  const streams = useVideoStreams({forceLocalStream});

  const {width, height} = useWindowDimensions();

  const mediaStyle = {
    width: streams.length > 2 ? width / 2 : width,
    height: streams.length > 1 ? height / 2 : height,
  };

  const fullWidthMediaStyle = {...mediaStyle, width};

  const mediaStyles = [
    [mediaStyle],
    [mediaStyle, mediaStyle],
    [mediaStyle, mediaStyle, fullWidthMediaStyle],
  ];

  return (
    <View style={styles.wrapper}>
      {streams.map((stream, i) => (
        <RTCView
          style={mediaStyles[streams.length - 1][i]}
          objectFit="cover"
          streamURL={stream.toURL()}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
});

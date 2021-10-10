import React from 'react';
import {StyleSheet, useWindowDimensions, View} from 'react-native';
import {Stream} from '@app/models';
import {useLocalAudioStream, useRemoteStream} from '@app/hooks';
import {RTCView} from 'react-native-webrtc';
import {ReactionCanvas} from './ReactionCanvas';
import {useMediaStreaming} from '@app/hooks/useMediaStreaming';
import {StreamOverlay} from './StreamOverlay';

interface IRemoteStreamProps {
  stream: Stream;
}

export const RemoteStream = (props: IRemoteStreamProps) => {
  const {id} = props.stream;

  const {stream: audioStream} = useLocalAudioStream();
  const {videoStreams} = useRemoteStream(id);

  useMediaStreaming({
    stream: audioStream,
    kind: 'audio',
  });

  const {width, height} = useWindowDimensions();

  const wrapperStyle = {
    ...styles.wrapper,
    height,
    width,
  };

  const mediaStyle = {
    ...styles.media,
    height,
    width,
  };

  return (
    <View style={wrapperStyle}>
      {videoStreams[0] && (
        <RTCView
          objectFit="cover"
          style={mediaStyle}
          streamURL={videoStreams[0].toURL()}
        />
      )}

      <ReactionCanvas />

      <StreamOverlay />
    </View>
  );
};

const styles = StyleSheet.create({
  media: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: '#ff3030',
  },
  wrapper: {
    backgroundColor: '#30ff30',
  },
});

import React, {useMemo} from 'react';
import {StyleSheet, useWindowDimensions, View} from 'react-native';
import {Stream} from '@app/models';
import {
  useLocalAudioStream,
  useLocalVideoStream,
  useRemoteStream,
  useRemoteStreams,
} from '@app/hooks';
import {RTCView} from 'react-native-webrtc';
import {ReactionCanvas} from './ReactionCanvas';
import {StreamOverlay} from './StreamOverlay';
import {useStore} from '@app/store';

interface IRemoteStreamProps {
  stream: Stream;
}

export const RemoteStream = (props: IRemoteStreamProps) => {
  const {id} = props.stream;

  const {stream: localVideoStream} = useLocalVideoStream();
  const {stream: audioStream} = useLocalAudioStream();
  const {videoStreams} = useRemoteStreams();

  const role = useStore.use.role();

  const streams = useMemo(() => {
    if (localVideoStream && role === 'streamer') {
      return [localVideoStream, ...videoStreams];
    } else {
      return videoStreams;
    }
  }, [localVideoStream, videoStreams]);

  useRemoteStream(id);

  console.log(streams);

  const {width, height} = useWindowDimensions();

  const wrapperStyle = {
    ...styles.wrapper,
    height,
    width,
  };

  const mediaStyle = {
    ...styles.media,
    width: streams.length > 2 ? width / 2 : width,
    height: streams.length > 1 ? height / 2 : height,
  };

  return (
    <View style={wrapperStyle}>
      {streams.map(stream => (
        <RTCView
          style={mediaStyle}
          objectFit="cover"
          streamURL={stream.toURL()}
        />
      ))}

      <ReactionCanvas />

      <StreamOverlay />
    </View>
  );
};

const styles = StyleSheet.create({
  media: {
    backgroundColor: '#ff3030',
  },
  wrapper: {
    backgroundColor: '#30ff30',
    flexWrap: 'wrap',
  },
});

import {
  useLocalAudioStream,
  useLocalVideoStream,
  useMediaStreaming,
  useRemoteStreams,
} from '@app/hooks';
import {RTCView} from 'react-native-webrtc';
import React, {useCallback, useMemo, useState} from 'react';
import {View, StyleSheet, useWindowDimensions} from 'react-native';
import {Button} from '@app/components';
import {useStore} from '@app/store';
import shallow from 'zustand/shallow';
import {StreamOverlay} from '@app/components/StreamOverlay';

export const NewStream = () => {
  const [title, setTitle] = useState('test stream');
  const [hub, setHub] = useState('60ec569668b42c003304630b');
  const [streamId, createStream, api] = useStore(
    state => [state.stream, state.create, state.api],
    shallow,
  );

  const {width, height} = useWindowDimensions();
  useLocalAudioStream();

  const {stream} = useLocalVideoStream();

  const {videoStreams} = useRemoteStreams();

  const streams = useMemo(() => {
    if (stream) {
      return [stream, ...videoStreams];
    } else {
      return videoStreams;
    }
  }, [stream, videoStreams]);

  const onStart = useCallback(() => {
    if (streamId) {
      return;
    }

    createStream(title, hub);
  }, [title, streamId, hub, api]);

  const localStreamStyle = {
    ...styles.localStream,
    width: streams.length > 2 ? width / 2 : width,
    height: streams.length > 1 ? height / 2 : height,
  };

  return (
    <View style={styles.wrapper}>
      {streams.map(stream => {
        console.log(stream);

        return (
          <RTCView
            style={localStreamStyle}
            objectFit="cover"
            streamURL={stream.toURL()}
          />
        );
      })}

      {streamId && <StreamOverlay />}

      {!streamId && (
        <View style={styles.startStreamButton}>
          <Button onPress={onStart} title="Start" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  localStream: {
    backgroundColor: '#303030',
  },
  allowSpeaking: {
    position: 'absolute',
    bottom: 90,
    left: 0,
    right: 0,
  },
  startStreamButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    height: 70,
  },
  wrapper: {
    flex: 1,
    backgroundColor: '#303030',
    flexWrap: 'wrap',
  },
});

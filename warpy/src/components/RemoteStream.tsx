import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Stream} from '@app/models';
import {ReactionCanvas} from './ReactionCanvas';
import {StreamOverlay} from './StreamOverlay';
import {Room} from './Streams';
import {useRemoteStreamController} from '@app/hooks';
import {useVideoStreams} from '@app/hooks/useVideoStreams';

interface IRemoteStreamProps {
  stream: Stream;
}

export const RemoteStream = (props: IRemoteStreamProps) => {
  const {id} = props.stream;
  useRemoteStreamController(id);

  const streams = useVideoStreams({});

  return (
    <View style={styles.wrapper}>
      {streams.length > 0 && (
        <>
          <StreamOverlay />
        </>
      )}
      <Room />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#000',
  },
});

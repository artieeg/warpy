import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Stream} from '@app/models';
import {ReactionCanvas} from './ReactionCanvas';
import {StreamOverlay} from './StreamOverlay';
import {Streams} from './Streams';
import {useRemoteStreamController} from '@app/hooks';

interface IRemoteStreamProps {
  stream: Stream;
}

export const RemoteStream = (props: IRemoteStreamProps) => {
  const {id} = props.stream;
  useRemoteStreamController(id);

  return (
    <View style={styles.wrapper}>
      <Streams />
      <ReactionCanvas />
      <StreamOverlay />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#30ff30',
  },
});

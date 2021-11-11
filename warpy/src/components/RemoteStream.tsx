import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Stream} from '@app/models';
import {StreamOverlay} from './StreamOverlay';
import {Room} from './Room';
import {useRemoteStreamController} from '@app/hooks';
import {ReactionCanvas} from './ReactionCanvas';

interface IRemoteStreamProps {
  stream: Stream;
}

export const RemoteStream = (props: IRemoteStreamProps) => {
  const {id} = props.stream;
  useRemoteStreamController(id);

  return (
    <View style={styles.wrapper}>
      <Room />
      <ReactionCanvas />
      <StreamOverlay />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#000',
    flex: 1,
  },
});

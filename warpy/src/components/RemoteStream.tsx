import React from 'react';
import {StyleSheet, View} from 'react-native';
import {StreamOverlay} from './StreamOverlay';
import {Room} from './Room';
import {useRemoteStreamController} from '@app/hooks';
import {ReactionCanvas} from './ReactionCanvas';
import {AwardDisplay} from './AwardDisplay';
import {IStream} from '@warpy/lib';

interface IRemoteStreamProps {
  stream: IStream;
}

export const RemoteStream = (props: IRemoteStreamProps) => {
  const {id} = props.stream;
  useRemoteStreamController(id);

  return (
    <View style={styles.wrapper}>
      <Room />
      <AwardDisplay />
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

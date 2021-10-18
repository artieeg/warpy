import React from 'react';
import {StyleSheet, useWindowDimensions, View} from 'react-native';
import {Stream} from '@app/models';
import {useRemoteStream} from '@app/hooks';
import {ReactionCanvas} from './ReactionCanvas';
import {StreamOverlay} from './StreamOverlay';
import {Streams} from './Streams';

interface IRemoteStreamProps {
  stream: Stream;
}

export const RemoteStream = (props: IRemoteStreamProps) => {
  const {id} = props.stream;

  useRemoteStream(id);

  const {width, height} = useWindowDimensions();

  const wrapperStyle = {
    ...styles.wrapper,
    height,
    width,
  };

  return (
    <View style={wrapperStyle}>
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

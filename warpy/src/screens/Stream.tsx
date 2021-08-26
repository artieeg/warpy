import {RemoteStream} from '@app/components';
import React from 'react';
import {View, StyleSheet} from 'react-native';

export const Stream = (props: any) => {
  const {route} = props;
  const {stream} = route.params;

  return (
    <View style={styles.wrapper}>
      <RemoteStream stream={stream} />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
});

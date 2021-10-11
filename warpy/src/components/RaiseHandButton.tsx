import {useStore} from '@app/store';
import React from 'react';
import {StyleSheet} from 'react-native';
import {IconButton} from './IconButton';

export const RaiseHandButton = () => {
  const api = useStore.use.api();

  return (
    <IconButton
      onPress={() => api.stream.raiseHand()}
      color="#ffffff"
      name="hand"
      size={30}
      style={styles.hand}
    />
  );
};

const styles = StyleSheet.create({
  hand: {
    transform: [{rotate: '-10deg'}],
  },
});

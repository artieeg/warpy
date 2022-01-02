import React from 'react';
import {StyleSheet} from 'react-native';
import {IconButton} from './IconButton';
import {useStore} from '@app/store';
import {colors} from '../../colors';

export const HostNewStreamButton = () => {
  return (
    <IconButton
      name="plus"
      size={24}
      style={styles.button}
      onPress={() => useStore.getState().dispatchStreamCreate()}
    />
  );
};

const styles = StyleSheet.create({
  button: {
    height: 50,
    width: 50,
    borderRadius: 25,
    backgroundColor: colors.green,
  },
});

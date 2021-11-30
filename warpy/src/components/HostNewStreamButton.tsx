import React from 'react';
import {StyleSheet} from 'react-native';
import {textStyles} from './Text';
import {IconButton} from './IconButton';
import {useStore} from '@warpy/store';

export const HostNewStreamButton = () => {
  const dispatchCreateStream = useStore.use.dispatchStreamCreate();

  return (
    <IconButton
      name="plus"
      size={24}
      style={styles.button}
      onPress={dispatchCreateStream}
    />
  );
};

const styles = StyleSheet.create({
  button: {
    height: 50,
    width: 50,
    borderRadius: 25,
    backgroundColor: textStyles.bright.color,
  },
});

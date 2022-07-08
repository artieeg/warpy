import React from 'react';
import {StyleSheet} from 'react-native';
import {IconButton} from './IconButton';
import {useDispatcher} from '@app/store';
import {colors} from '../../colors';

export const HostNewStreamButton = () => {
  const dispatch = useDispatcher();

  return (
    <IconButton
      name="plus"
      size={24}
      style={styles.button}
      onPress={() => dispatch(({stream}) => stream.create())}
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

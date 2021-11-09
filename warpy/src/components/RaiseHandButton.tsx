import {useStore} from '@app/store';
import React from 'react';
import {StyleSheet} from 'react-native';
import shallow from 'zustand/shallow';
import {IconButton} from './IconButton';
import {IconButtonToggle} from './IconButtonToggle';

export const RaiseHandButton = () => {
  const [isRaisingHand, dispatchUserHandRaiseToggle] = useStore(
    state => [state.isRaisingHand, state.dispatchUserHandRaiseToggle],
    shallow,
  );

  return (
    <IconButtonToggle
      enabled={isRaisingHand}
      onToggle={dispatchUserHandRaiseToggle}
      icon="hand"
      style={styles.hand}
    />
  );
};

const styles = StyleSheet.create({
  hand: {
    transform: [{rotate: '-10deg'}],
  },
});

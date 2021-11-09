import {useStore} from '@app/store';
import React, {useEffect, useRef} from 'react';
import {Animated, StyleSheet} from 'react-native';
import shallow from 'zustand/shallow';
import {IconButtonToggle} from './IconButtonToggle';

export const RaiseHandButton = () => {
  const [isRaisingHand, dispatchUserHandRaiseToggle] = useStore(
    state => [state.isRaisingHand, state.dispatchUserHandRaiseToggle],
    shallow,
  );

  const rotation = useRef(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(rotation.current, {
      toValue: isRaisingHand ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isRaisingHand]);

  return (
    <IconButtonToggle
      enabled={isRaisingHand}
      onToggle={dispatchUserHandRaiseToggle}
      icon="hand"
      style={{
        ...styles.hand,
        transform: [
          {
            rotate: rotation.current.interpolate({
              inputRange: [0, 1],
              outputRange: ['0deg', '-25deg'],
            }),
          },
        ],
      }}
    />
  );
};

const styles = StyleSheet.create({
  hand: {
    transform: [{rotate: '-10deg'}],
  },
});

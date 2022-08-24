import {useDispatcher, useStore} from '@app/store';
import React, {useEffect, useRef} from 'react';
import {Animated, StyleSheet} from 'react-native';
import {IconButtonToggle} from './IconButtonToggle';

export const RaiseHandButton = () => {
  const dispatch = useDispatcher();
  const isRaisingHand = useStore(state => state.isRaisingHand);

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
      onToggle={() => dispatch(({user}) => user.requestStreamPermission())}
      icon="hand"
      style={{
        ...styles.hand,
        transform: [
          {
            rotate: rotation.current.interpolate({
              inputRange: [0, 1],
              outputRange: ['-25deg', '0deg'],
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

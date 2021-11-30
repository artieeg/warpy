import {useStore} from '@app/store';
import React, {useEffect, useRef} from 'react';
import {StyleSheet, Animated} from 'react-native';
import {Text} from './Text';

const FADE_DURATION = 100;

export const ToastProvider = () => {
  const message = useStore.use.message();
  const duration = useStore.use.duration();

  const opacity = useRef(new Animated.Value(0));
  const translateY = useRef(new Animated.Value(20));

  useEffect(() => {
    if (!message) {
      return;
    }

    Animated.sequence([
      Animated.parallel([
        Animated.timing(translateY.current, {
          toValue: 0,
          duration: FADE_DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(opacity.current, {
          toValue: 1,
          duration: FADE_DURATION,
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(duration === 'LONG' ? 3000 : 1000),
      Animated.parallel([
        Animated.timing(translateY.current, {
          toValue: 20,
          duration: FADE_DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(opacity.current, {
          toValue: 0,
          duration: FADE_DURATION,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      useStore.setState({
        message: null,
      });
    });
  }, [message]);

  const animatedStyle = {
    transform: [{translateY: translateY.current}],
    opacity: opacity.current,
  };

  return (
    <>
      {message && (
        <Animated.View style={[styles.toast, animatedStyle]}>
          <Text weight="bold" size="xsmall" color="dark">
            {message}
          </Text>
        </Animated.View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    bottom: 30,
    paddingHorizontal: 10,
    left: 30,
    right: 30,
    height: 60,
    backgroundColor: '#fff',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

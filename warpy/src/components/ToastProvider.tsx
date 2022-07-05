import {useStore, useStoreShallow} from '@app/store';
import React, {useEffect, useMemo, useRef} from 'react';
import {StyleSheet} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useDerivedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import {Text} from './Text';

const FADE_DURATION = 100;
const TOAST_DURATION_LONG = 5000;
const TOAST_DURATION_SHORT = 1000;

export const ToastProvider = () => {
  const [message, duration] = useStoreShallow(state => [
    state.message,
    state.duration,
  ]);

  const delay = useMemo(
    () => (duration === 'LONG' ? TOAST_DURATION_LONG : TOAST_DURATION_SHORT),
    [duration],
  );

  const opacity = useDerivedValue(() => {
    if (!message) {
      return 0;
    }

    return withSequence(
      withTiming(1, {
        duration: FADE_DURATION,
        easing: Easing.ease,
      }),
      withDelay(
        delay,
        withTiming(0, {duration: FADE_DURATION, easing: Easing.ease}),
      ),
    );
  }, [message, duration, delay]);

  const translateY = useDerivedValue(() => {
    if (!message) {
      return 20;
    }

    return withSequence(
      withTiming(0, {
        duration: FADE_DURATION,
        easing: Easing.ease,
      }),
      withDelay(
        delay,
        withTiming(20, {duration: FADE_DURATION, easing: Easing.ease}),
      ),
    );
  }, [message, duration, delay]);

  const style = useAnimatedStyle(
    () => ({
      transform: [{translateY: translateY.value}],
      opacity: opacity.value,
    }),
    [translateY, opacity],
  );

  const timeout = useRef<any>();
  useEffect(() => {
    clearTimeout(timeout.current);

    timeout.current = setTimeout(() => {
      useStore.setState({
        message: null,
      });
    }, FADE_DURATION * 2 + delay);
  }, [message]);

  return (
    <>
      {message && (
        <Animated.View style={[styles.toast, style]}>
          <Text weight="bold" size="xsmall" color="black">
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

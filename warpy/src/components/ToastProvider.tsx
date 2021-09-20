import React, {createContext, useEffect, useRef, useState} from 'react';
import {StyleSheet, View, Animated} from 'react-native';
import {Text} from './Text';

export enum Toast {
  LONG,
  SHORT,
}

type ToastMessage = {
  duration: Toast;
  text: string;
};

interface IToastContext {
  show: (message: ToastMessage) => void;
}

export const ToastContext = createContext<IToastContext | null>(null);

const FADE_DURATION = 100;

export const ToastProvider = (props: any) => {
  const [message, setMessage] = useState<ToastMessage>();

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
      Animated.delay(message.duration === Toast.LONG ? 2000 : 1000),
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
    ]).start();
  }, [message]);

  const animatedStyle = {
    transform: [{translateY: translateY.current}],
    opacity: opacity.current,
  };

  return (
    <>
      <ToastContext.Provider
        {...props}
        value={{
          show(message) {
            setMessage(message);
          },
        }}
      />

      {message && (
        <Animated.View style={[styles.toast, animatedStyle]}>
          <Text weight="bold" size="xsmall" color="dark">
            {message.text}
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

import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

export interface IRoundButtonProps extends TouchableOpacityProps {
  children?: React.ReactChild;
  style?: any;
  onPress?: any;
  onPressIn?: any;
  onPressOut?: any;
}

export const RoundButton = (props: IRoundButtonProps) => {
  const {children, onPress, onPressIn, onPressOut, style} = props;

  const scale = useSharedValue(1);

  const onPressWrapper = React.useCallback(() => {
    scale.value = withSequence(
      withTiming(0.9, {duration: 100, easing: Easing.ease}),
      withTiming(1, {duration: 100, easing: Easing.ease}),
    );

    setTimeout(() => {
      onPress?.(undefined);
    }, 20);
  }, [onPress]);

  const onPressInWrapper = React.useCallback(() => {
    scale.value = withTiming(0.9, {duration: 200, easing: Easing.exp});
    onPressIn?.();
  }, [onPressIn]);

  const onPressOutWrapper = React.useCallback(() => {
    scale.value = withTiming(1, {duration: 200, easing: Easing.exp});
  }, [onPressOut]);

  const animatedWrapperStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
  }));

  return (
    <Animated.View style={animatedWrapperStyle}>
      <TouchableOpacity
        onPressOut={onPressOutWrapper}
        onPressIn={onPressInWrapper}
        activeOpacity={1.0}
        onPress={onPressWrapper}
        style={[styles.wrapper, style]}>
        {children}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#011A287F',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

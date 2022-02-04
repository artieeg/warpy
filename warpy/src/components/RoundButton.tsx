import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

export interface IRoundButtonProps {
  children?: React.ReactChild;
  style?: any;
  onPress?: any;
}

export const RoundButton = (props: IRoundButtonProps) => {
  const {children, onPress, style} = props;

  const scale = useSharedValue(1);

  const onPressWrapper = React.useCallback(() => {
    scale.value = withSequence(
      withTiming(0.9, {duration: 100, easing: Easing.ease}),
      withTiming(1, {duration: 100, easing: Easing.ease}),
    );

    //TODO: use animated's call
    setTimeout(() => {
      onPress?.();
    }, 200);
  }, [onPress]);

  const onPressIn = React.useCallback(() => {
    scale.value = withTiming(0.9, {duration: 200, easing: Easing.exp});
  }, []);

  const onPressOut = React.useCallback(() => {
    scale.value = withTiming(1, {duration: 200, easing: Easing.exp});
  }, []);

  const animatedWrapperStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
  }));

  return (
    <Animated.View style={animatedWrapperStyle}>
      <TouchableOpacity
        onPressOut={onPressOut}
        onPressIn={onPressIn}
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

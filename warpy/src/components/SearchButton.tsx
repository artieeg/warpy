import React from 'react';
import {StyleSheet} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import {Icon} from './Icon';
import {RoundButton} from './RoundButton';

interface IStartNewSteramButtonProps {
  onPress: () => any;
  style: any;
}

export const SearchButton = (props: IStartNewSteramButtonProps) => {
  const {onPress, style} = props;

  const x = useSharedValue(0);

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{translateX: x.value}],
  }));

  return (
    <RoundButton
      onPressIn={() => {
        x.value = withRepeat(
          withSequence(
            withTiming(5, {duration: 100}),
            withTiming(-5, {duration: 100}),
            withTiming(0, {duration: 100}),
          ),
          1,
        );
      }}
      style={[style, styles.button]}
      onPress={onPress}>
      <Animated.View style={iconStyle}>
        <Icon name="search" size={20} color="#BDF971" />
      </Animated.View>
    </RoundButton>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#202020',
  },
});

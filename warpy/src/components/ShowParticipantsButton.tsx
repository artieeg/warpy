import {useStore, useStoreShallow} from '@app/store';
import {StyleSheet, View} from 'react-native';
import React from 'react';
import {RoundButton} from './RoundButton';
import {Text} from './Text';
import Animated, {
  interpolateColor,
  Layout,
  useAnimatedStyle,
  useDerivedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import {colors} from '../../colors';

export const ShowParticipantsButton = (props: {style: any}) => {
  const [count, isHost, unseenRaisedHands] = useStoreShallow(state => [
    state.totalParticipantCount,
    state.currentStreamHost === state.user?.id,
    state.unseenRaisedHands,
  ]);

  const indicatorVisibility = useDerivedValue(() => {
    if (isHost) {
      return unseenRaisedHands > 0 ? 1 : 0;
    }

    return 0;
  }, [isHost, unseenRaisedHands]);

  const colorTransition = useDerivedValue(() => {
    return;
  }, []);

  const indicatorStyle = useAnimatedStyle(() => ({
    opacity: withTiming(indicatorVisibility.value, {duration: 100}),
    transform: [
      {
        scale: withTiming(0.3 + (indicatorVisibility.value - 0.3), {
          duration: 100,
        }),
      },
    ],
  }));

  return (
    <RoundButton
      {...props}
      onPress={() => useStore.getState().dispatchModalOpen('participants')}>
      <>
        <Text color="white" weight="bold" size="small">
          {count.toString()}
        </Text>

        <Animated.View style={[styles.raisedHandIndicator, indicatorStyle]} />
      </>
    </RoundButton>
  );
};

const styles = StyleSheet.create({
  raisedHandIndicator: {
    position: 'absolute',
    right: 5,
    top: 5,
    borderRadius: 99,
    width: 10,
    height: 10,
    backgroundColor: '#ffffff',
  },
});

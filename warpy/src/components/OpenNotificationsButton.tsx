import {useStore} from '@app/store';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import {Icon} from './Icon';
import {IRoundButtonProps, RoundButton} from './RoundButton';

export const OpenNotificationsButton = (props: IRoundButtonProps) => {
  const {style} = props;

  const hasUnseenNotifications = useStore(
    state => state.hasUnseenNotifications,
  );

  const rotation = useSharedValue(0);

  const bellStyle = useAnimatedStyle(() => ({
    transform: [{rotate: `${rotation.value}deg`}],
  }));

  return (
    <RoundButton
      {...props}
      onPressIn={() => {
        rotation.value = withRepeat(withTiming(15, {duration: 50}), 4, true);
      }}
      style={[style, styles.button]}>
      <>
        <Animated.View style={bellStyle}>
          <Icon name="bell" size={20} color="#BDF971" />
        </Animated.View>
        {hasUnseenNotifications && (
          <View style={styles.newNotificationsCircle} />
        )}
      </>
    </RoundButton>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#202020',
  },
  newNotificationsCircle: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: 15,
    height: 15,
    backgroundColor: '#F9F871',
    borderRadius: 15,
  },
});

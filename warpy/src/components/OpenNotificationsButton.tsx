import {useStore} from '@app/store';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useSharedValue, withRepeat, withTiming} from 'react-native-reanimated';
import {Icon} from './Icon';
import {IRoundButtonProps, RoundButton} from './RoundButton';

export const OpenNotificationsButton = (props: IRoundButtonProps) => {
  const {style} = props;

  const hasUnseenNotifications = useStore(
    state => state.hasUnseenNotifications,
  );

  return (
    <RoundButton {...props} style={[style, styles.button]}>
      <>
        <Icon name="bell" size={20} color="#BDF971" />
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

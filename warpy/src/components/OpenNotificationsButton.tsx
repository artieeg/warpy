import {useStore} from '@app/store';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Bell} from './icons';
import {IRoundButtonProps, RoundButton} from './RoundButton';

export const OpenNotificationsButton = (props: IRoundButtonProps) => {
  const {style} = props;

  const hasUnseenNotifications = useStore.use.hasUnseenNotifications();

  return (
    <RoundButton {...props} style={[style, styles.button]}>
      <>
        <Bell width={22} height={22} fill="#BDF971" />
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

import React from 'react';
import {View, StyleSheet} from 'react-native';
import {IInvite, INotification} from '@warpy/lib';
import {Avatar} from './Avatar';
import {Text} from './Text';

interface INotificationProps {
  notification: INotification;
}

const InviteNotification = ({invite}: {invite: IInvite}) => (
  <View style={styles.wrapper}>
    <Avatar user={invite.inviter} />
    <View style={styles.info}>
      <Text size="xsmall" weight="bold">
        {invite.inviter.username}
      </Text>
      <Text size="xsmall" color="white" weight="bold">
        invited you to join the Waterfalls & chill live stream
      </Text>
    </View>
  </View>
);

export const Notification = ({notification}: INotificationProps) => {
  const {invite} = notification;

  if (invite) {
    return <InviteNotification invite={invite} />;
  }

  return <View></View>;
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  info: {
    marginLeft: 10,
    flex: 1,
  },
});

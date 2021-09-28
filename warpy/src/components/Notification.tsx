import React from 'react';
import {View, StyleSheet, TouchableWithoutFeedback} from 'react-native';
import {IInvite, INotification} from '@warpy/lib';
import {Avatar} from './Avatar';
import {Text} from './Text';
import {useNavigation} from '@react-navigation/native';

interface INotificationProps {
  notification: INotification;
}

const InviteNotification = ({invite}: {invite: IInvite}) => {
  const navigation = useNavigation();

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        navigation.navigate('Stream', {stream: invite.stream});
      }}>
      <View style={styles.wrapper}>
        <Avatar user={invite.inviter} />
        <View style={styles.info}>
          <Text size="xsmall" weight="bold">
            {invite.inviter.username}
          </Text>
          <Text size="xsmall" color="white" weight="bold">
            invited you to join the {invite.stream.title} live stream
          </Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export const Notification = ({notification}: INotificationProps) => {
  const {invite} = notification;

  const renderNotificationContent = () => {
    if (invite) {
      return <InviteNotification invite={invite} />;
    }
  };

  return <View>{renderNotificationContent()}</View>;
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

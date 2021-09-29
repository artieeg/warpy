import React, {useEffect, useRef} from 'react';
import {
  View,
  Animated,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
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

  const opacity = useRef(new Animated.Value(0));

  const renderNotificationContent = () => {
    if (invite) {
      return <InviteNotification invite={invite} />;
    }
  };

  const style = {
    opacity: opacity.current,
  };

  useEffect(() => {
    Animated.timing(opacity.current, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  });

  return (
    <Animated.View style={style}>{renderNotificationContent()}</Animated.View>
  );
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

import React, {useEffect, useMemo, useRef} from 'react';
import {
  View,
  Animated,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import {INotification} from '@warpy/lib';
import {Avatar} from './Avatar';
import {Text} from './Text';
import {useNavigation} from '@react-navigation/native';
import moment from 'moment';

interface INotificationProps {
  notification: INotification;
}

const InviteNotification = ({notification}: INotificationProps) => {
  const navigation = useNavigation();

  //Keep showing the circle regardless if state has updated
  const hasBeenSeen = useMemo(() => notification.hasBeenSeen, []);

  const invite = notification.invite!;

  const timeFromNow = useMemo(
    () => moment(notification.created_at).fromNow(),
    [],
  );

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        navigation.navigate('Stream', {stream: invite.stream});
      }}>
      <View style={styles.wrapper}>
        <Avatar user={invite.inviter} />
        <View style={styles.info}>
          <View style={[styles.row, styles.space]}>
            <View style={styles.row}>
              <Text size="xsmall" weight="bold">
                {invite.inviter.username}
              </Text>
              {!hasBeenSeen && <View style={styles.new} />}
            </View>
            <Text size="xsmall" color="info" weight="bold">
              {timeFromNow}
            </Text>
          </View>
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
      return <InviteNotification notification={notification} />;
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
    <Animated.View style={[style, styles.animatedWrapper]}>
      {renderNotificationContent()}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  animatedWrapper: {
    flexDirection: 'row',
  },
  wrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  info: {
    marginLeft: 10,
    flex: 1,
  },
  new: {
    width: 15,
    height: 15,
    backgroundColor: '#F9F871',
    borderRadius: 15,
    marginHorizontal: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  space: {
    justifyContent: 'space-between',
  },
});

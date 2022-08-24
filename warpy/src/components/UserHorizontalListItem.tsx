import React, {useCallback} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {FriendFeedItem} from '@warpy/lib';
import {Avatar} from './Avatar';
import {Text} from './Text';
import {useDispatcher} from '@app/store';

interface FriendFeedItemProps {
  item: FriendFeedItem;
}

export const UserHorizontalListItem = ({item: {user}}: FriendFeedItemProps) => {
  const dispatch = useDispatcher();

  const onPress = useCallback(() => {
    dispatch(({modal}) => modal.open('participant-info', {selectedUser: user}));
  }, []);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={styles.container}>
      <View>
        <Avatar user={user} size="large" />
      </View>

      <Text color="boulder" size="xxsmall">
        {user.username}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  indicator: {
    backgroundColor: '#BDF971',
    width: 15,
    height: 15,
    borderRadius: 10,
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
});

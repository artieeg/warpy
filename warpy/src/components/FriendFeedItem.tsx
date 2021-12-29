import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {IFriendFeedItem} from '@warpy/lib';
import {Avatar} from './Avatar';
import {Text} from './Text';

interface FriendFeedItemProps {
  item: IFriendFeedItem;
}

export const FriendFeedItem = ({item}: FriendFeedItemProps) => {
  return (
    <TouchableOpacity activeOpacity={0.8} style={styles.container}>
      <View>
        <Avatar user={item.user} size="large" />
        <View style={styles.indicator} />
      </View>

      <Text color="info" size="xxsmall">
        {item.user.username}
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

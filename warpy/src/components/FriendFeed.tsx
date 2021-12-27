import {useStore} from '@app/store';
import React from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
import {FriendFeedItem} from './FriendFeedItem';

export const FriendFeed = () => {
  const feed = useStore.use.friendFeed();

  return (
    <View>
      <FlatList
        horizontal
        data={feed}
        contentContainerStyle={styles.list}
        renderItem={({item}) => <FriendFeedItem item={item} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  list: {
    paddingBottom: 20,
    paddingLeft: 20,
  },
});

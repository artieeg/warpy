import {useStoreShallow} from '@app/store';
import React, {useMemo} from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
import {IFriendFeedItem} from '@warpy/lib';
import {UserHorizontalListItem} from './UserHorizontalListItem';

export const FriendFeed = () => {
  const [friendFeed, following] = useStoreShallow(state => [
    state.friendFeed,
    state.list_following.list,
  ]);

  const feed: IFriendFeedItem[] = useMemo(
    () => [
      ...friendFeed,
      ...following
        .filter(
          followedUser =>
            !friendFeed.find(item => item.user.id === followedUser.id),
        )
        .map(user => ({user, stream: undefined})),
    ],
    [friendFeed, following],
  );

  if (feed.length === 0) {
    return null;
  }

  return (
    <View>
      <FlatList
        horizontal
        data={feed}
        contentContainerStyle={styles.list}
        renderItem={({item}) => <UserHorizontalListItem item={item} />}
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

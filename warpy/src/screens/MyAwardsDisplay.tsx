import {AwardFeedItem} from '@app/components/AwardFeedItem';
import {useStore, useStoreShallow} from '@app/store';
import React, {useEffect} from 'react';
import {View, StyleSheet, FlatList} from 'react-native';

export const MyAwardsDisplay = () => {
  const [awards, userId, dispatchFetchReceivedAwards] = useStoreShallow(
    state => [
      state.awards[state.user!.id],
      state.user!.id,
      state.dispatchFetchReceivedAwards,
    ],
  );

  useEffect(() => {
    dispatchFetchReceivedAwards(userId, true);
  }, []);

  return (
    <View style={styles.wrapper}>
      <FlatList
        style={styles.container}
        data={awards}
        renderItem={({item}) => {
          return <AwardFeedItem award={item} />;
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#000',
  },
  container: {
    paddingHorizontal: 20,
  },
});

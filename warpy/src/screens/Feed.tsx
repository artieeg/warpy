import {FriendFeed, StreamFeedView} from '@app/components';
import {ScreenHeader} from '@app/components/ScreenHeader';
import {StreamCategoryList} from '@app/components/StreamCategoryList';
import {useFeed} from '@app/hooks';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {TextButton} from '@warpy/components';
import {useNavigation} from '@react-navigation/native';

export const Feed = () => {
  const feed = useFeed();
  const navigation = useNavigation();

  const onStartStream = React.useCallback(() => {
    navigation.navigate('NewStream');
  }, [navigation]);

  return (
    <View style={styles.wrapper}>
      <ScreenHeader />
      <FriendFeed />
      <StreamCategoryList mode="browse-feed" />
      <StreamFeedView feed={feed} />
      <View style={styles.startStreamButtonWrapper}>
        <TextButton onPress={onStartStream} title="start a room now" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#000',
    flex: 1,
  },
  startStreamButtonWrapper: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
});

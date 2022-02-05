import {FriendFeed, StreamFeedView} from '@app/components';
import {ScreenHeader} from '@app/components/ScreenHeader';
import {StreamCategoryList} from '@app/components/StreamCategoryList';
import {useFeed} from '@app/hooks';
import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {TextButton} from '@warpy/components';
import {useNavigation} from '@react-navigation/native';

export const Feed = () => {
  const feed = useFeed();
  const navigation = useNavigation();

  const onStartStream = React.useCallback(() => {
    navigation.navigate('NewStream');
  }, [navigation]);

  const interval = useRef<any>();

  const [isMinimized, setMinimized] = useState(false);

  useEffect(() => {
    clearInterval(interval.current);

    interval.current = setInterval(() => {
      setMinimized(prev => !prev);
    }, 2000);
  }, []);

  return (
    <View style={styles.wrapper}>
      <ScreenHeader />
      <FriendFeed />
      <StreamCategoryList
        moveCurrentCategory={isMinimized}
        mode="browse-feed"
      />
      <StreamFeedView data={feed} />
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

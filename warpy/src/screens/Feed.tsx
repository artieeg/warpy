import {FriendFeed, StreamFeedView} from '@app/components';
import {ScreenHeader} from '@app/components/ScreenHeader';
import {StreamCategoryList} from '@app/components/StreamCategoryList';
import {useFeed} from '@app/hooks';
import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {TextButton} from '@warpy/components';
import {useNavigation} from '@react-navigation/native';
import Animated, {useAnimatedStyle, withTiming} from 'react-native-reanimated';

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

  const feedWrapperStyle = useAnimatedStyle(() => ({
    marginTop: withTiming(isMinimized ? -40 : 0, {duration: 400}),
  }));

  return (
    <View style={styles.wrapper}>
      <ScreenHeader minimized={isMinimized} />
      <FriendFeed />
      <StreamCategoryList
        moveCurrentCategory={isMinimized}
        mode="browse-feed"
      />
      <Animated.View style={feedWrapperStyle}>
        <StreamFeedView data={feed} />
      </Animated.View>
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

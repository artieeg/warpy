import {StreamPreview, FriendFeed} from '@app/components';
import {ScreenHeader} from '@app/components/ScreenHeader';
import {StreamCategoryList} from '@app/components/StreamCategoryList';
import {useFeed, usePreviewDimensions} from '@app/hooks';
import React from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {ICandidate} from '@warpy/lib';
import {TextButton} from '@warpy/components';
import {useNavigation} from '@react-navigation/native';

export const Feed = () => {
  const feed = useFeed();
  const {previewHeight, previewWidth} = usePreviewDimensions();
  const navigation = useNavigation();

  const renderItem = React.useCallback(
    ({item, index}: {item: ICandidate; index: number}) => {
      let style: any = {
        maxWidth: previewWidth,
        width: previewWidth,
      };

      if (index === 1) {
        style = {
          ...style,
          height: previewHeight - 100,
        };
      } else {
        style = {...style, width: previewWidth, height: previewHeight};
      }

      if (index % 2 && index !== 1) {
        style = {...style, transform: [{translateY: -100}]};
      }

      return <StreamPreview stream={item} style={style} />;
    },
    [],
  );

  const onStartStream = React.useCallback(() => {
    navigation.navigate('NewStream');
  }, [navigation]);

  return (
    <View style={styles.wrapper}>
      <ScreenHeader />
      <FriendFeed />
      <StreamCategoryList mode="browse-feed" />
      <FlatList data={feed} numColumns={2} renderItem={renderItem} />
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

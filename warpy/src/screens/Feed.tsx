import {StreamPreview, FriendFeed} from '@app/components';
import {ScreenHeader} from '@app/components/ScreenHeader';
import {StreamCategoryList} from '@app/components/StreamCategoryList';
import {useFeed, usePreviewDimensions} from '@app/hooks';
import React from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {ICandidate} from '@warpy/lib';

export const Feed = () => {
  const feed = useFeed();
  const {previewHeight, previewWidth} = usePreviewDimensions();

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

  return (
    <View style={styles.wrapper}>
      <ScreenHeader />
      <FriendFeed />
      <StreamCategoryList mode="browse-feed" />
      <FlatList data={feed} numColumns={2} renderItem={renderItem} />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#000',
    flex: 1,
  },
});

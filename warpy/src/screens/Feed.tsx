import {StreamPreview} from '@app/components';
import {ScreenHeader} from '@app/components/ScreenHeader';
import {StreamCategoryList} from '@app/components/StreamCategoryList';
import {useFeed, usePreviewDimensions} from '@app/hooks';
import React from 'react';
import {FlatList, StyleSheet, View} from 'react-native';

export const Feed = () => {
  const feed = useFeed();
  const {previewHeight, previewWidth} = usePreviewDimensions();

  return (
    <View style={styles.wrapper}>
      <ScreenHeader />
      <StreamCategoryList mode="browse-feed" />
      <FlatList
        data={feed}
        numColumns={2}
        renderItem={({index, item}) => {
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
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#000',
    flex: 1,
  },
});

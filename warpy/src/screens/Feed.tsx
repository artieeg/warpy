import {Avatar, StreamPreview, Button, Text} from '@app/components';
import {useAppUser, useFeed, usePreviewDimensions} from '@app/hooks';
import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {FlatList, StyleSheet, useWindowDimensions, View} from 'react-native';

export const Feed = () => {
  const feed = useFeed();

  const navigation = useNavigation();
  const user = useAppUser();

  const {previewHeight} = usePreviewDimensions();

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <Text size="large" weight="extraBold">
          /feed
        </Text>
        <Avatar user={user!} />
      </View>
      <FlatList
        data={[1, 2, 3, 4]}
        numColumns={2}
        renderItem={({index}) => {
          let style = {};

          if (index === 1) {
            style = {...style, height: previewHeight - 100};
          } else {
            style = {...style, height: previewHeight};
          }

          if (index % 2 && index !== 1) {
            style = {...style, transform: [{translateY: -100}]};
          }

          return <StreamPreview style={style} />;
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
  header: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

import {
  Avatar,
  StreamPreview,
  Text,
  StartNewStreamButton,
  Toast,
} from '@app/components';
import {useAppUser, useFeed, usePreviewDimensions} from '@app/hooks';
import {useToast} from '@app/hooks/useToast';
import {Stream} from '@app/models';
import {useNavigation} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';

export const Feed = () => {
  const feed = useFeed();

  const user = useAppUser();

  const {previewHeight, previewWidth} = usePreviewDimensions();

  const navigation = useNavigation();

  const onStartStream = () => {
    navigation.navigate('NewStream');
  };

  const onOpenStream = (stream: Stream) => {
    navigation.navigate('Stream', {stream});
  };

  const toast = useToast();

  useEffect(() => {
    const interval = setInterval(() => {
      toast.show({
        text: `this is some toast message, kinda long ${Date.now()}`,
        duration: Toast.LONG,
      });
    }, 4531);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <Text size="large" weight="extraBold">
          /feed
        </Text>
        <View style={styles.row}>
          <StartNewStreamButton
            style={styles.headerButton}
            onPress={onStartStream}
          />
          <Avatar user={user!} />
        </View>
      </View>
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

          return (
            <StreamPreview
              onPress={() => onOpenStream(item)}
              stream={item}
              style={style}
            />
          );
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    marginRight: 10,
  },
});

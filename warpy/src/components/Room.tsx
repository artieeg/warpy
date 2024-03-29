import {StyleSheet, useWindowDimensions, View} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {useVideoStreams} from '@app/hooks/useVideoStreams';
import React, {useMemo} from 'react';
import {RTCView} from 'react-native-webrtc';
import {useStoreShallow} from '@app/store';
import {ParticipantView} from './ParticipantView';

export const Room = () => {
  const streams = useVideoStreams();

  const {width, height} = useWindowDimensions();

  const mediaStyle = {
    width: streams.length > 2 ? width / 2 : width,
    height: streams.length > 1 ? height / 2 : height,
  };

  const fullWidthMediaStyle = {...mediaStyle, width};

  const mediaStyles = [
    [mediaStyle],
    [mediaStyle, mediaStyle],
    [mediaStyle, mediaStyle, fullWidthMediaStyle],
  ];

  const [streamers, viewers] = useStoreShallow(state => [
    state.streamers,
    state.viewers,
  ]);

  const participants = useMemo(
    () => Object.values(streamers),
    [streamers, viewers],
  );

  if (streams.length > 0) {
    return (
      <View style={styles.videoWrapper}>
        {streams.map((stream, i) => (
          <RTCView
            key={stream.id}
            style={mediaStyles[streams.length - 1][i]}
            objectFit="cover"
            streamURL={stream.toURL()}
          />
        ))}
      </View>
    );
  } else {
    return (
      <View style={styles.wrapper}>
        <FlatList
          contentContainerStyle={styles.listContent}
          style={styles.listC}
          data={participants}
          renderItem={({item}) => <ParticipantView data={item} />}
          numColumns={3}
        />
      </View>
    );
  }
};

const styles = StyleSheet.create({
  videoWrapper: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    backgroundColor: '#000000',
  },
  wrapper: {
    flexDirection: 'row',
    backgroundColor: '#000000',
    flex: 1,
  },
  listC: {},
  listContent: {
    paddingTop: 80,
  },
});

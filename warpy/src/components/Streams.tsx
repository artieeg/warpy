import {
  FlatList,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import {useVideoStreams} from '@app/hooks/useVideoStreams';
import React, {useMemo} from 'react';
import {RTCView} from 'react-native-webrtc';
import {useStore} from '@app/store';
import shallow from 'zustand/shallow';
import {AudioRoomParticipant} from './AudioRoomParticipant';

interface IStreamsProps {
  forceLocalStream?: boolean;
}

export const Room = ({forceLocalStream}: IStreamsProps) => {
  const streams = useVideoStreams({forceLocalStream});

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

  const [streamers, viewers] = useStore(
    state => [state.streamers, state.viewers],
    shallow,
  );

  const participants = useMemo(
    () => Object.values(streamers),
    [streamers, viewers],
  );

  if (streams.length > 0) {
    return (
      <View style={styles.videoWrapper}>
        {streams.map((stream, i) => (
          <RTCView
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
          contentContainerStyle={styles.list}
          data={participants}
          renderItem={({item}) => <AudioRoomParticipant data={item} />}
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
  },
  list: {
    paddingTop: 80,
  },
});

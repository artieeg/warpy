import {Stream} from '@app/models';
import React, {useCallback} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {Avatar} from './Avatar';
import {ViewersCountPreview} from './ViewersCountPreview';
import {StreamPreviewTitle} from './StreamPreviewTitle';
import {useNavigation} from '@react-navigation/native';
import Video from 'react-native-video';

interface IStreamPreviewProps {
  stream: Stream;
  style: any;
}

export const StreamPreview = React.memo((props: IStreamPreviewProps) => {
  const {style, stream} = props;
  const {preview} = stream;
  const navigation = useNavigation();

  const onPress = useCallback(() => {
    navigation.navigate('Stream', {stream});
  }, [navigation]);

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={[styles.wrapper, style]}>
        {preview && (
          <Video
            repeat
            muted
            paused={false}
            resizeMode="cover"
            source={{uri: preview}}
            style={styles.video}
          />
        )}

        {!preview && <View style={styles.video} />}
        <View style={styles.info}>
          <StreamPreviewTitle>{stream.title}</StreamPreviewTitle>
          <View style={styles.participants}>
            {stream.speakers.slice(0, 3).map((participant, index) => {
              const userAvatarStyle = {
                transform: [{translateX: -index * 3}],
              };

              return (
                <Avatar
                  size="small"
                  style={userAvatarStyle}
                  user={participant}
                />
              );
            })}
            <ViewersCountPreview
              count={stream.participants}
              style={styles.viewersCount}
            />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#ACC3FD',
    flex: 1,
    overflow: 'hidden',
    margin: 10,
    borderRadius: 20,
  },
  video: {
    flex: 1,
    backgroundColor: '#5C73FD',
  },
  participants: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  info: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  viewersCount: {
    transform: [{translateX: -8}],
  },
});

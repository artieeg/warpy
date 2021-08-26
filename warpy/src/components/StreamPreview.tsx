import {Stream} from '@app/models';
import React from 'react';
import Video from 'react-native-video';
import {View, StyleSheet} from 'react-native';
import {Avatar} from './Avatar';

interface IStreamPreviewProps {
  stream: Stream;
  style: any;
}

export const StreamPreview = (props: IStreamPreviewProps) => {
  const {style, stream} = props;
  const {preview} = stream;

  console.log('speakers', stream.speakers);

  return (
    <View style={[styles.wrapper, style]}>
      <Video
        repeat
        muted
        paused={false}
        resizeMode="cover"
        source={{uri: preview}}
        style={styles.video}
      />
      <View style={styles.participants}>
        {stream.speakers.slice(0, 3).map((participant, index) => {
          const userAvatarStyle = {
            transform: [{translateX: -index * 5}],
          };

          return (
            <Avatar size="small" style={userAvatarStyle} user={participant} />
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#ACC3FD',
    flex: 1,
    overflow: 'hidden',
    margin: 10,
    borderRadius: 30,
  },
  video: {
    flex: 1,
    backgroundColor: '#ACC3FD',
  },
  participants: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
  },
});

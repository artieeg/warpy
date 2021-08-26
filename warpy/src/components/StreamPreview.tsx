import {Stream} from '@app/models';
import React from 'react';
import Video from 'react-native-video';
import {View, StyleSheet} from 'react-native';

interface IStreamPreviewProps {
  stream: Stream;
  style: any;
}

export const StreamPreview = (props: IStreamPreviewProps) => {
  const {style, stream} = props;
  const {preview} = stream;

  console.log('preview', preview);
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
});

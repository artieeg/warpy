import React, {useCallback, useMemo} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {Avatar} from './Avatar';
import {ViewersCountPreview} from './ViewersCountPreview';
import {useNavigation} from '@react-navigation/native';
import Video from 'react-native-video';
import {colors} from '../../colors';
import tinycolor from 'tinycolor2';
import {Candidate} from '@warpy/lib';
import {Text} from './Text';

interface IStreamPreviewProps {
  stream: Candidate;
  style: any;
}

export const StreamPreview = React.memo((props: IStreamPreviewProps) => {
  const {style, stream} = props;
  const {preview} = stream;
  const navigation = useNavigation();

  const color = useMemo(
    () =>
      tinycolor(colors.green)
        .spin(Math.random() * 360)
        .toHexString(),
    [],
  );

  const onPress = useCallback(() => {
    navigation.navigate('Stream', {stream});
  }, [navigation]);

  return (
    <TouchableOpacity activeOpacity={1.0} onPress={onPress}>
      <View style={[styles.wrapper, {backgroundColor: color}, style]}>
        {preview && (
          <>
            <Video
              repeat
              muted
              paused={false}
              resizeMode="cover"
              source={{uri: preview}}
              style={styles.video}
            />
            <View style={styles.overlay} />
          </>
        )}

        <View style={[styles.info, !preview && styles.centeredInfo]}>
          <Text
            color={!!preview ? 'white' : 'cod_gray'}
            size="small"
            style={styles.title}>
            {stream.title}
          </Text>
          <View style={styles.participants}>
            {stream.streamers.slice(0, 3).map((participant, index) => {
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
              count={stream.total_participants}
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
    flex: 1,
    overflow: 'hidden',
    //marginHorizontal: 10,
    marginBottom: 10,
    marginTop: 0,
    borderRadius: 6,
  },
  video: {
    flex: 1,
  },
  participants: {
    flexDirection: 'row',
  },
  title: {
    marginBottom: 15,
  },
  info: {
    position: 'absolute',
    bottom: 20,
    left: 10,
    right: 10,
  },
  centeredInfo: {
    bottom: 0,
    top: 0,
    justifyContent: 'center',
  },
  viewersCount: {
    transform: [{translateX: -8}],
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    top: 0,
    backgroundColor: '#0000004c',
  },
});

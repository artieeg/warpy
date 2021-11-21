import {useStore} from '@app/store';
import {IParticipant} from '@warpy/lib';
import React, {useCallback} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import shallow from 'zustand/shallow';
import {AudioLevelIndicator} from './AudioLevelIndicator';
import {Avatar} from './Avatar';
import {Text} from './Text';

interface AudioRoomParticipantProps {
  data: IParticipant;
  onPress?: any;
}

export const AudioRoomParticipant = ({
  data,
  onPress: providedOnPress,
}: AudioRoomParticipantProps) => {
  const [userAudioLevel, dispatchModalOpen, dispatchAudioLevelDelete] =
    useStore(
      state => [
        state.userAudioLevels[data.id],
        state.dispatchModalOpen,
        state.dispatchAudioLevelDelete,
      ],
      shallow,
    );

  const onLongPress = useCallback(() => {
    if (providedOnPress) {
      providedOnPress();
    } else {
      dispatchModalOpen('user-actions', {selectedUser: data.id});
    }
  }, [providedOnPress]);

  const onPress = useCallback(() => {
    if (providedOnPress) {
      providedOnPress();
    } else {
      dispatchModalOpen('participant-info', {selectedUser: data.id});
    }
  }, [providedOnPress]);

  return (
    <TouchableOpacity
      style={{...styles.wrapper}}
      onLongPress={onLongPress}
      onPress={onPress}>
      <AudioLevelIndicator
        volume={userAudioLevel || 0}
        minScale={1}
        onDoneSpeaking={() => dispatchAudioLevelDelete(data.id)}>
        <Avatar useRNImage size="large" user={data} style={styles.avatar} />
      </AudioLevelIndicator>
      <Text weight="bold" size="xsmall">
        {data.first_name}
      </Text>

      <Text weight="bold" color="info" size="xsmall">
        {data.role}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    marginTop: 20,
    flex: 1,
  },
  avatar: {
    marginBottom: 10,
  },
});

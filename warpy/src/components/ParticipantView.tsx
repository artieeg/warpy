import {useDispatcher, useStoreShallow} from '@app/store';
import {IParticipant} from '@warpy/lib';
import React, {useCallback} from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {AudioLevelIndicator} from './AudioLevelIndicator';
import {Avatar} from './Avatar';
import {Text} from './Text';

interface ParticipantViewProps {
  data: IParticipant;
  onPress?: any;
}

export const ParticipantView = ({
  data,
  onPress: providedOnPress,
}: ParticipantViewProps) => {
  const dispatch = useDispatcher();
  const [userAudioLevel] = useStoreShallow(state => [
    state.userAudioLevels[data.id],
  ]);

  const onPress = useCallback(() => {
    if (providedOnPress) {
      providedOnPress();
    } else {
      dispatch(({modal}) =>
        modal.open('participant-info', {selectedUser: data}),
      );
    }
  }, [providedOnPress]);

  return (
    <TouchableOpacity style={{...styles.wrapper}} onPress={onPress}>
      <AudioLevelIndicator
        volume={userAudioLevel || 0}
        minScale={1}
        onDoneSpeaking={() =>
          dispatch(({stream}) => stream.delAudioLevel(data.id))
        }>
        <Avatar useRNImage size="large" user={data} style={styles.avatar} />
      </AudioLevelIndicator>
      <Text weight="bold" size="xsmall">
        {data.first_name}
      </Text>

      <Text weight="bold" color="boulder" size="xsmall">
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

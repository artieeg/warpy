import {useStore} from '@app/store';
import {IParticipant} from '@warpy/lib';
import React from 'react';
import {View, StyleSheet} from 'react-native';
import shallow from 'zustand/shallow';
import {AudioLevelIndicator} from './AudioLevelIndicator';
import {Avatar} from './Avatar';
import {Text} from './Text';

export const AudioRoomParticipant = ({data}: {data: IParticipant}) => {
  const [userAudioLevel, dispatchAudioLevelDelete] = useStore(
    state => [state.userAudioLevels[data.id], state.dispatchAudioLevelDelete],
    shallow,
  );

  return (
    <View style={styles.wrapper}>
      <View style={{alignItems: 'center'}}>
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
      </View>

      <View
        style={{
          position: 'absolute',
          borderRadius: 25,
          borderWidth: 1,
          width: '100%',
          borderColor: 'transparent',
          zIndex: 10,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    flex: 1,
    marginTop: 20,
  },
  avatar: {
    marginBottom: 10,
  },
});

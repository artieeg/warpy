import {useStore, useStoreShallow} from '@app/store';
import {useNavigation} from '@react-navigation/native';
import React, {useCallback} from 'react';
import {Alert} from 'react-native';
import {IconButton} from './IconButton';

export const StopStream = () => {
  const [api, stream, isHost] = useStoreShallow(store => [
    store.api,
    store.stream,
    store.currentStreamHost === store.user!.id,
  ]);

  const navigation = useNavigation();

  const onLeave = useCallback(async () => {
    if (!stream) {
      return;
    }

    if (isHost) {
      Alert.alert(
        'Before you leave...',
        'Do you want to assign a host, end the room or just leave?',
        [
          {
            text: 'assign a host',
            onPress: async () => {
              useStore
                .getState()
                .dispatchModalOpen('host-reassign', {closeAfterReassign: true});
            },
          },
          {
            text: 'end the room',
            onPress: async () => {
              await useStore.getState().dispatchStreamLeave({
                shouldStopStream: true,
                stream,
              });

              navigation.navigate('Feed');
            },
          },
          {
            text: 'just leave',
            onPress: async () => {
              await useStore.getState().dispatchStreamLeave({
                shouldStopStream: false,
                stream,
              });
              navigation.navigate('Feed');
            },
          },
        ],
      );
    } else {
      await useStore.getState().dispatchStreamLeave({
        shouldStopStream: false,
        stream,
      });
      navigation.navigate('Feed');
    }
  }, [navigation, api, stream]);

  return (
    <IconButton onPress={onLeave} color="#ffffff" size={30} name="hand-wave" />
  );
};

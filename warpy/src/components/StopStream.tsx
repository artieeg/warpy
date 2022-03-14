import {useStoreShallow} from '@app/store';
import {useNavigation} from '@react-navigation/native';
import React, {useCallback} from 'react';
import {IconButton} from './IconButton';

export const StopStream = () => {
  const [api, stream] = useStoreShallow(store => [store.api, store.stream]);

  const navigation = useNavigation();

  const onLeave = useCallback(async () => {
    if (!stream) {
      return;
    }

    await api.stream.leave(stream);

    navigation.navigate('Feed');
  }, [navigation, api, stream]);

  return (
    <IconButton onPress={onLeave} color="#ffffff" size={30} name="hand-wave" />
  );
};

import {useStore} from '@app/store';
import {useNavigation} from '@react-navigation/native';
import React, {useCallback} from 'react';
import {IconButton} from './IconButton';

export const StopStream = () => {
  const api = useStore.use.api();

  const navigation = useNavigation();

  const onLeave = useCallback(async () => {
    await api.stream.leave();

    navigation.navigate('Feed');
  }, [navigation, api]);

  return (
    <IconButton onPress={onLeave} color="#ffffff" size={30} name="hand-wave" />
  );
};

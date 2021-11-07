import {useStore} from '@app/store';
import React from 'react';
import {StyleSheet} from 'react-native';
import {IconButton} from './IconButton';

export const StopStream = () => {
  const api = useStore.use.api();

  return (
    <IconButton
      onPress={() => api.stream.returnToViewer()}
      color="#ffffff"
      size={30}
      name="hand-wave"
    />
  );
};

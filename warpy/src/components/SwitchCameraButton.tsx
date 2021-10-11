import {useStore} from '@app/store';
import React from 'react';
import {IconButton} from './IconButton';

export const SwitchCameraButton = () => {
  const switchCamera = useStore.use.switchCamera();

  return (
    <IconButton
      onPress={switchCamera}
      color="#ffffff"
      name="toggle-camera"
      size={30}
    />
  );
};

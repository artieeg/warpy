import {useStore} from '@warpy/store';
import React from 'react';
import {IconButton} from './IconButton';

export const SwitchCameraButton = () => {
  const dispatchCameraSwitch = useStore.use.dispatchCameraSwitch();

  return (
    <IconButton
      onPress={dispatchCameraSwitch}
      color="#ffffff"
      name="toggle-camera"
      size={30}
    />
  );
};

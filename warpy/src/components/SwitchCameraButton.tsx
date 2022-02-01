import {useStore} from '@app/store';
import React from 'react';
import {IconButton} from './IconButton';

export const SwitchCameraButton = () => {
  const dispatchCameraSwitch = useStore.use.dispatchCameraSwitch();

  return (
    <IconButton
      onPress={dispatchCameraSwitch}
      color="#ffffff"
      name="refresh-1"
      size={24}
    />
  );
};

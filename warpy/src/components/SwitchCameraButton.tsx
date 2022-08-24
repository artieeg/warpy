import {useDispatcher} from '@app/store';
import React from 'react';
import {IconButton} from './IconButton';

export const SwitchCameraButton = () => {
  const dispatch = useDispatcher();

  return (
    <IconButton
      onPress={() => dispatch(({media}) => media.switchCamera())}
      color="#ffffff"
      name="refresh-1"
      size={24}
    />
  );
};

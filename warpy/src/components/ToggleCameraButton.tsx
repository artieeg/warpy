import {useStore} from '@app/store';
import React from 'react';
import shallow from 'zustand/shallow';
import {IconButton} from './IconButton';

export const ToggleCameraButton = () => {
  const [videoEnabled, dispatchVideoToggle] = useStore(
    state => [state.videoEnabled, state.dispatchVideoToggle],
    shallow,
  );

  return (
    <IconButton
      onPress={() => dispatchVideoToggle()}
      color="#ffffff"
      name={videoEnabled ? 'video' : 'video-off'}
      size={30}
    />
  );
};

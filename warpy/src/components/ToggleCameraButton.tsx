import {useStore} from '@app/store';
import React from 'react';
import shallow from 'zustand/shallow';
import {IconButton} from './IconButton';

export const ToggleCameraButton = () => {
  const [videoStopped, dispatchVideoToggle] = useStore(
    state => [state.videoStopped, state.dispatchVideoToggle],
    shallow,
  );

  return (
    <IconButton
      onPress={() => dispatchVideoToggle(!videoStopped)}
      color="#ffffff"
      name={videoStopped ? 'video' : 'video-off'}
      size={30}
    />
  );
};

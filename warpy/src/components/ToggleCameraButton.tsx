import {useStore} from '@app/store';
import React from 'react';
import shallow from 'zustand/shallow';
import {IconButtonToggle} from './IconButtonToggle';

export const ToggleCameraButton = () => {
  const [videoEnabled, dispatchVideoToggle] = useStore(
    state => [state.videoEnabled, state.dispatchVideoToggle],
    shallow,
  );

  return (
    <IconButtonToggle
      onToggle={dispatchVideoToggle}
      enabled={videoEnabled}
      icon={videoEnabled ? 'camera' : 'camera'}
    />
  );
};

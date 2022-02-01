import {useStore} from '@app/store';
import React from 'react';
import shallow from 'zustand/shallow';
import {IconButtonToggle} from './IconButtonToggle';

export const ToggleMicButton = () => {
  const [dispatchAudioToggle, audioEnabled] = useStore(
    state => [state.dispatchAudioToggle, state.audioEnabled],
    shallow,
  );

  return (
    <IconButtonToggle
      onToggle={dispatchAudioToggle}
      enabled={audioEnabled}
      icon={audioEnabled ? 'mic-on' : 'mic-on'}
    />
  );
};

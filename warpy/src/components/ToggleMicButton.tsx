import {useStore} from '@app/store';
import React from 'react';
import {IconButton} from './IconButton';
import shallow from 'zustand/shallow';

export const ToggleMicButton = () => {
  const [dispatchAudioToggle, enabled] = useStore(
    state => [state.dispatchAudioToggle, state.audioEnabled],
    shallow,
  );

  return (
    <IconButton
      onPress={() => dispatchAudioToggle()}
      color="#ffffff"
      name={enabled ? 'mic-on' : 'mic-off'}
      size={30}
    />
  );
};

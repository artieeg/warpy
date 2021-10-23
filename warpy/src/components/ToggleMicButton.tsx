import {useStore} from '@app/store';
import React from 'react';
import {IconButton} from './IconButton';
import shallow from 'zustand/shallow';

export const ToggleMicButton = () => {
  const [dispatchAudioToggle, muted] = useStore(
    state => [state.dispatchAudioToggle, state.audioMuted],
    shallow,
  );

  return (
    <IconButton
      onPress={() => dispatchAudioToggle(!muted)}
      color="#ffffff"
      name={muted ? 'mic-off' : 'mic-on'}
      size={30}
    />
  );
};

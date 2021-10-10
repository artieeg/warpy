import {useStore} from '@app/store';
import React from 'react';
import {IconButton} from './IconButton';
import shallow from 'zustand/shallow';

export const ToggleMicButton = () => {
  const [toggleAudio, muted] = useStore(
    state => [state.toggleAudio, state.audioMuted],
    shallow,
  );

  return (
    <IconButton
      onPress={() => toggleAudio(!muted)}
      color="#ffffff"
      name={muted ? 'mic-off' : 'mic-on'}
      size={30}
    />
  );
};

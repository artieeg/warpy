import {useDispatcher, useStore} from '@app/store';
import React from 'react';
import {IconButtonToggle} from './IconButtonToggle';

export const ToggleMicButton = () => {
  const dispatch = useDispatcher();
  const audioEnabled = useStore(state => state.audioEnabled);

  return (
    <IconButtonToggle
      onToggle={() => dispatch(({media}) => media.toggleAudio())}
      enabled={audioEnabled}
      icon={audioEnabled ? 'mic-on' : 'mic-on'}
    />
  );
};

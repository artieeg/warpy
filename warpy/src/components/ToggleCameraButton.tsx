import {useDispatcher, useStoreShallow} from '@app/store';
import React from 'react';
import {IconButtonToggle} from './IconButtonToggle';

export const ToggleCameraButton = () => {
  const dispatch = useDispatcher();

  const [videoEnabled] = useStoreShallow(state => [state.videoEnabled]);

  return (
    <IconButtonToggle
      onToggle={() => dispatch(({media}) => media.toggleVideo())}
      enabled={videoEnabled}
      icon={videoEnabled ? 'camera' : 'camera'}
    />
  );
};

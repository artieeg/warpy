import {useStore} from '@app/store';
import React from 'react';
import {IconButton} from './IconButton';

export const ChatButton = () => {
  const openNewModal = useStore.use.openNewModal();

  return (
    <IconButton
      onPress={() => openNewModal('chat')}
      color="#ffffff"
      name="chat"
      size={30}
    />
  );
};

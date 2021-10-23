import {useStore} from '@app/store';
import React from 'react';
import {IconButton} from './IconButton';

export const ChatButton = () => {
  const dispatchModalOpen = useStore.use.dispatchModalOpen();

  return (
    <IconButton
      onPress={() => dispatchModalOpen('chat')}
      color="#ffffff"
      name="chat"
      size={30}
    />
  );
};

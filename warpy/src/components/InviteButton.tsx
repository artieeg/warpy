import {useStore} from '@app/store';
import React from 'react';
import {IconButton} from './IconButton';

export const InviteButton = () => {
  const dispatchModalOpen = useStore.use.dispatchModalOpen();

  return (
    <IconButton
      onPress={() => dispatchModalOpen('invite')}
      name="user-add"
      color="#ffffff"
      size={24}
    />
  );
};

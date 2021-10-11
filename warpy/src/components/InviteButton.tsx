import {useStore} from '@app/store';
import React from 'react';
import {IconButton} from './IconButton';

export const InviteButton = () => {
  const openNewModal = useStore.use.openNewModal();

  return (
    <IconButton
      onPress={() => openNewModal('invite')}
      name="invite-user"
      color="#ffffff"
      size={30}
    />
  );
};

import {useStore} from '@app/store';
import React from 'react';
import {IconButton} from './IconButton';

export const InviteButton = () => {
  const dispatchModalOpen = useStore.use.dispatchModalOpen();

  return (
    <IconButton
      onPress={() => dispatchModalOpen('invite')}
      name="invite-user"
      color="#ffffff"
      size={30}
    />
  );
};

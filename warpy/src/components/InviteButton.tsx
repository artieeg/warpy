import {useStore} from '@app/store';
import React from 'react';
import {IconButton} from './IconButton';

export const InviteButton = () => {
  return (
    <IconButton
      onPress={() => useStore.getState().dispatchModalOpen('invite')}
      name="user-add"
      color="#ffffff"
      size={24}
    />
  );
};

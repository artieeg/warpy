import {useDispatcher} from '@app/store';
import React from 'react';
import {IconButton} from './IconButton';

export const InviteButton = () => {
  const dispatch = useDispatcher();

  return (
    <IconButton
      onPress={() => dispatch(({modal}) => modal.open('invite'))}
      name="user-add"
      color="#ffffff"
      size={24}
    />
  );
};

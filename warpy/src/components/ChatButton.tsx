import {useDispatcher} from '@app/store';
import React from 'react';
import {IconButton} from './IconButton';

export const ChatButton = () => {
  const dispatch = useDispatcher();

  return (
    <IconButton
      onPress={() => dispatch(({modal}) => modal.open('chat'))}
      color="#ffffff"
      name="chat"
      size={30}
    />
  );
};

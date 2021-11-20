import {useStore} from '@app/store';
import React, {useCallback} from 'react';
import shallow from 'zustand/shallow';
import {IconButton} from './IconButton';

export const AwardButton = () => {
  const [dispatchModalOpen, streamHasOneSpeaker, id] = useStore(
    useCallback(
      state => [
        state.dispatchModalOpen,
        Object.keys(state.streamers).length === 1,
        state.streamers[Object.keys(state.streamers)[0]]?.id,
      ],
      [],
    ),
    shallow,
  );

  const onPress = useCallback(() => {
    if (streamHasOneSpeaker) {
      dispatchModalOpen('award', {
        userToAward: id,
      });
    } else {
    }
  }, [dispatchModalOpen]);

  return <IconButton onPress={onPress} size={30} name="medal" color="#fff" />;
};

import {useStoreShallow} from '@app/store';
import React, {useCallback} from 'react';
import {IconButton} from './IconButton';

export const AwardButton = () => {
  const [dispatchModalOpen, streamHasOneSpeaker, id] = useStoreShallow(
    state => [
      state.dispatchModalOpen,
      Object.keys(state.streamers).length === 1,
      state.streamers[Object.keys(state.streamers)[0]]?.id,
    ],
  );

  const onPress = useCallback(() => {
    if (streamHasOneSpeaker) {
      dispatchModalOpen('award', {
        userToAward: id,
      });
    } else {
      dispatchModalOpen('award-recipent');
    }
  }, [dispatchModalOpen, streamHasOneSpeaker]);

  return <IconButton onPress={onPress} size={30} name="medal" color="#fff" />;
};

import {useStoreShallow} from '@app/store';
import React, {useCallback} from 'react';
import {IconButton} from './IconButton';

export const AwardButton = () => {
  const [dispatchModalOpen, streamHasOneSpeaker, id] = useStoreShallow(
    state => [
      state.dispatchModalOpen,
      Object.keys(state.streamers).filter(
        streamer => streamer !== state.user!.id,
      ).length === 1,
      Object.keys(state.streamers).find(id => id !== state.user!.id),
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

import {useStoreShallow} from '@app/store';
import React, {useCallback} from 'react';
import {IconButton} from './IconButton';

export const AwardButton = () => {
  const [dispatchModalOpen, streamHasOneSpeaker, streamer] = useStoreShallow(
    state => [
      state.dispatchModalOpen,
      Object.keys(state.streamers).filter(
        streamer => streamer !== state.user!.id,
      ).length === 1,
      Object.values(state.streamers)[0],
    ],
  );

  const onPress = useCallback(() => {
    if (streamHasOneSpeaker) {
      dispatchModalOpen('award-visual', {
        userToAward: streamer,
      });
    } else {
      dispatchModalOpen('award-recipent');
    }
  }, [dispatchModalOpen, streamHasOneSpeaker]);

  return <IconButton onPress={onPress} size={30} name="medal" color="#fff" />;
};

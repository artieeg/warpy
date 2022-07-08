import {useDispatcher, useStoreShallow} from '@app/store';
import React, {useCallback} from 'react';
import {IconButton} from './IconButton';

export const AwardButton = () => {
  const dispatch = useDispatcher();

  const [streamHasOneSpeaker, streamer] = useStoreShallow(state => [
    Object.keys(state.streamers).filter(streamer => streamer !== state.user!.id)
      .length === 1,
    Object.values(state.streamers)[0],
  ]);

  const onPress = useCallback(() => {
    if (streamHasOneSpeaker) {
      dispatch(({modal}) =>
        modal.open('award-visual', {
          userToAward: streamer,
        }),
      );
    } else {
      dispatch(({modal}) => modal.open('award-recipent'));
    }
  }, [streamHasOneSpeaker]);

  return <IconButton onPress={onPress} size={24} name="badge-1" color="#fff" />;
};

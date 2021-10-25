import {useStore} from '@app/store';
import {useMemo} from 'react';
import shallow from 'zustand/shallow';
import {useStreamParticipant} from './useStreamParticipant';

export const useParticipantModalController = () => {
  const [
    currentModal,
    modalSelectedUser,
    following,
    dispatchFollowingAdd,
    dispatchFollowingRemove,
  ] = useStore(
    state => [
      state.modalCurrent,
      state.modalSelectedUser,
      state.following,
      state.dispatchFollowingAdd,
      state.dispatchFollowingRemove,
    ],
    shallow,
  );

  const visible = currentModal === 'participant-info';
  const isFollowing = useMemo(
    () => following.includes(modalSelectedUser!),
    [following, modalSelectedUser],
  );

  const participant = useStreamParticipant(modalSelectedUser!);

  const onToggleFollow = async () => {
    if (!participant) {
      return;
    }

    if (isFollowing) {
      dispatchFollowingRemove(participant.id);
    } else {
      dispatchFollowingAdd(participant.id);
    }
  };

  return {
    visible,
    participant,
    isFollowing,
    onToggleFollow,
  };
};
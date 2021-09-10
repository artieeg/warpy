import {useStreamStore} from '@app/stores';

export const useParticipantsCount = () => {
  return useStreamStore(store => store.totalParticipantCount);
};

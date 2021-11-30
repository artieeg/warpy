import {useStore} from '@app/store';

export const useParticipantsCount = () => {
  return useStore(store => store.totalParticipantCount);
};

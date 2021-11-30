import {useStore} from '@warpy/store';

export const useParticipantsCount = () => {
  return useStore(store => store.totalParticipantCount);
};

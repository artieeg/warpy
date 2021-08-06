import {useParticipantsStore} from '@app/stores';

export const useParticipantsCount = () => {
  return useParticipantsStore(store => store.count);
};

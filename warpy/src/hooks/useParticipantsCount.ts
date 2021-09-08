import {useParticipantStore} from '@app/stores';

export const useParticipantsCount = () => {
  return useParticipantStore(store => store.count);
};

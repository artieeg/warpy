import {Participant} from '@app/models';
import {useParticipantStore} from '@app/stores';

export const useStreamParticipant = (id: string): Participant | undefined => {
  return useParticipantStore(state => state.viewers[id]);
};

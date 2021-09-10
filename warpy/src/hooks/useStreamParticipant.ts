import {Participant} from '@app/models';
import {useStreamStore} from '@app/stores';
import shallow from 'zustand/shallow';

export const useStreamParticipant = (id: string): Participant | undefined => {
  return useStreamStore(state => state.viewers[id], shallow);
};

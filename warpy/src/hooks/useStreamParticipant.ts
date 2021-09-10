import {Participant} from '@app/models';
import {useStore} from '@app/store';
import shallow from 'zustand/shallow';

export const useStreamParticipant = (id: string): Participant | undefined => {
  return useStore(state => state.viewers[id], shallow);
};

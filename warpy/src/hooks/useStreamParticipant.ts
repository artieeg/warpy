import {useStore} from '@app/store';
import shallow from 'zustand/shallow';
import {Participant} from '@warpy/lib';

export const useStreamParticipant = (id?: string): Participant | undefined => {
  return useStore(state => state.viewers[id] || state.streamers[id], shallow);
};

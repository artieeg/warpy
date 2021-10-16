import {useStore} from '@app/store';
import shallow from 'zustand/shallow';
import {IParticipant} from '@warpy/lib';

export const useStreamParticipant = (id: string): IParticipant | undefined => {
  return useStore(state => state.consumers[id] || state.producers[id], shallow);
};

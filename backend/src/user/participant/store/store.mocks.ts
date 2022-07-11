import { getMockedInstance } from '@warpy-be/utils';
import { NjsParticipantStore } from './participant.store';

export const mockedParticipantStore =
  getMockedInstance<NjsParticipantStore>(NjsParticipantStore);

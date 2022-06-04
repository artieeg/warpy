import { getMockedInstance } from '@warpy-be/utils';
import { ParticipantStore } from './participant.store';

export const mockedParticipantStore =
  getMockedInstance<ParticipantStore>(ParticipantStore);

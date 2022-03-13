import { getMockedInstance } from '@warpy-be/utils';
import { ParticipantEntity } from './participant.entity';

export const mockedParticipantEntity =
  getMockedInstance<typeof ParticipantEntity.prototype>(ParticipantEntity);

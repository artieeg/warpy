import { getMockedInstance } from '@backend_2/utils';
import { ParticipantEntity } from './participant.entity';

export const mockedParticipantEntity =
  getMockedInstance<typeof ParticipantEntity.prototype>(ParticipantEntity);

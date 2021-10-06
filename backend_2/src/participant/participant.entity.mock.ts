import { ParticipantEntity } from './participant.entity';

export const mockedParticipantEntity: jest.Mocked<Partial<ParticipantEntity>> =
  {
    count: jest.fn().mockResolvedValue(1),
    getSpeakers: jest.fn().mockResolvedValue([]),
  };

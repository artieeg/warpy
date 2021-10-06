import { ParticipantEntity } from './participant.entity';

export const mockedParticipantEntity: jest.Mocked<Partial<ParticipantEntity>> =
  {
    count: jest.fn().mockResolvedValue(1),
    getSpeakers: jest.fn().mockResolvedValue([]),
    getCurrentStreamFor: jest.fn().mockResolvedValue('test'),
    getIdsByStream: jest.fn().mockResolvedValue(['id1', 'id2', 'id3']),
  };

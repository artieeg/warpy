import { ParticipantEntity } from './participant.entity';

function getMockedInstance(Source: any): jest.Mocked<any> {
  let mocked: any = {};
  Object.getOwnPropertyNames(Source.prototype).forEach((key) => {
    mocked[key] = jest.fn();
  });

  return mocked;
}

export const mockedParticipantEntity = getMockedInstance(ParticipantEntity);

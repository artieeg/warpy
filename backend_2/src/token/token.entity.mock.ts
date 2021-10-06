import { RefreshTokenEntity } from './refresh-token.entity';

export const mockedRefreshTokenEntity: jest.Mocked<
  Partial<RefreshTokenEntity>
> = {
  create: jest.fn(),
};

import { testModuleBuilder } from '@warpy-be/__fixtures__/app.module';
import { TokenService } from './token.service';

describe('TokenService', () => {
  let tokenService: TokenService;

  beforeAll(async () => {
    tokenService = (await testModuleBuilder.compile()).get(TokenService);
  });

  it('creates a new jwt token', () => {
    const token = tokenService.createAuthToken('test', false, '1y');

    expect(token).toBeTruthy();
  });
});

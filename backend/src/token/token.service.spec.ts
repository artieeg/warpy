import { testModuleBuilder } from '@warpy-be/__fixtures__/app.module';
import { NJTokenService } from './token.service';

describe('TokenService', () => {
  let tokenService: NJTokenService;

  beforeAll(async () => {
    tokenService = (await testModuleBuilder.compile()).get(NJTokenService);
  });

  it('creates a new jwt token', () => {
    const token = tokenService.createAuthToken('test', false, '1y');

    expect(token).toBeTruthy();
  });
});

import { Injectable } from '@nestjs/common';
import { RefreshTokenEntity } from './refresh-token.entity';
import { TokenService } from './token.service';

@Injectable()
export class RefreshTokenService {
  constructor(
    private token: TokenService,
    private refreshTokenEntity: RefreshTokenEntity,
  ) {}
}

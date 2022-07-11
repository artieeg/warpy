import { Injectable } from '@nestjs/common';
import { RefreshTokenEntity } from './refresh-token.entity';
import { NJTokenService } from './token.service';

@Injectable()
export class RefreshTokenService {
  constructor(
    private token: NJTokenService,
    private refreshTokenEntity: RefreshTokenEntity,
  ) {}
}

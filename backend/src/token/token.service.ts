import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TokenService } from 'lib/services';

@Injectable()
export class NJTokenService extends TokenService {
  constructor(configService: ConfigService) {
    super(configService.get('accessJwtSecret'));
  }
}

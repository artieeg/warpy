import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class TokenService {
  constructor(private configService: ConfigService) {}

  createToken(sub: string, expiresIn?: string) {
    const secret = this.configService.get<string>('accessJwtSecret');
    return jwt.sign({ sub }, secret, expiresIn ? { expiresIn } : undefined);
  }
}

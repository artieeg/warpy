import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class TokenService {
  constructor(private configService: ConfigService) {}

  createToken(data: any, params: jwt.SignOptions) {
    const secret = this.configService.get<string>('accessJwtSecret');

    return jwt.sign(data, secret, params);
  }

  decodeToken<T = any>(token: string) {
    return jwt.decode(token) as T;
  }

  createAuthToken(sub: string, isBot: boolean, expiresIn?: string) {
    return this.createToken({ sub, isBot }, { expiresIn });
  }
}

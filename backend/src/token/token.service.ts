import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import { Token, TokenImpl } from 'lib/services/token';

@Injectable()
export class TokenService implements Token {
  private token: Token;

  constructor(configService: ConfigService) {
    this.token = new TokenImpl(configService.get('accessJwtSecret'));
  }

  createToken(data: any, params?: jwt.SignOptions) {
    return this.token.createToken(data, params);
  }

  validateToken<T = any>(token: string) {
    return this.token.validateToken<T>(token);
  }

  decodeToken<T = any>(token: string) {
    return this.token.decodeToken<T>(token);
  }

  createAuthToken(sub: string, isBot: boolean, expiresIn?: string) {
    return this.token.createAuthToken(sub, isBot, expiresIn);
  }
}

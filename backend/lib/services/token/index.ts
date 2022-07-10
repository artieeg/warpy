import * as jwt from 'jsonwebtoken';

export interface Token {
  createToken: (data: any, params?: jwt.SignOptions) => string;
  validateToken: <T = any>(token: string) => T;
  decodeToken: <T = any>(token: string) => T;
  createAuthToken: (sub: string, isBot: boolean, expiresIn?: string) => string;
}

export class TokenImpl implements Token {
  constructor(private secret: string) {}

  createToken(data: any, params?: jwt.SignOptions) {
    return jwt.sign(data, this.secret, params);
  }

  validateToken<T = any>(token: string) {
    return jwt.verify(token, this.secret) as T;
  }

  decodeToken<T = any>(token: string) {
    return jwt.decode(token) as T;
  }

  createAuthToken(sub: string, isBot: boolean, expiresIn?: string) {
    return this.createToken({ sub, isBot }, expiresIn && { expiresIn });
  }
}

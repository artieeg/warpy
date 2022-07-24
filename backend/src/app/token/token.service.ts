import * as jwt from 'jsonwebtoken';

export class TokenService {
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

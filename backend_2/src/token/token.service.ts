import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class TokenService {
  createToken(sub: string, expiresIn: string) {
    return jwt.sign({ sub }, process.env.JWT_SECRET, { expiresIn });
  }
}

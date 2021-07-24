import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./consts";

interface Claims {
  room: string;
  canPublishAudio: boolean;
  canPublishVideo: boolean;
  canConsume: boolean;
}

export class Token {
  claims: Claims;
  expiresIn: string;

  constructor(claims: Claims, expiresIn: string = "1h") {
    this.claims = claims;
    this.expiresIn = expiresIn;
  }

  toString(): string {
    return JSON.stringify(this.claims);
  }

  toJWT(): string {
    return jwt.sign(this.toString(), JWT_SECRET, { expiresIn: this.expiresIn });
  }
}

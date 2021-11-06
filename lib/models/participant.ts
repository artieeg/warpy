import { Roles } from "../types";
import { IEntity } from "./entity";
import { IBaseUser } from "./user";

export interface IBaseParticipant extends IEntity {
  stream: string | null;
  role: Roles;
  isRaisingHand?: boolean;
  audioEnabled?: boolean;
  videoEnabled?: boolean;
  isBot: boolean;
}

export interface IParticipant extends IBaseUser, IBaseParticipant {}

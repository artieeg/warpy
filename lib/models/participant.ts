import { Roles } from "../types";
import { IEntity } from "./entity";
import { IBaseUser } from "./user";
import { Consumer } from "mediasoup-client/lib/types";

export interface IBaseParticipant extends IEntity {
  stream: string | null;
  role: Roles;
  isRaisingHand?: boolean;
  audioEnabled?: boolean;
  videoEnabled?: boolean;
  isBot: boolean;
}

export interface IParticipant extends IBaseUser, IBaseParticipant {}

export interface IParticipantWithMedia extends IParticipant {
  media?: {
    audio?: {
      consumer: Consumer;
      track: any;
      active: boolean;
    };
    video?: {
      consumer: Consumer;
      track: any;
      active: boolean;
    };
  };
}

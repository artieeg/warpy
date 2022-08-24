import { Roles } from "../types";
import { Item } from "./entity";
import { UserBase } from "./user";

export interface ParticipantBase extends Item {
  stream: string | null;
  role: Roles;
  isRaisingHand?: boolean;
  audioEnabled?: boolean;
  videoEnabled?: boolean;
  isBot: boolean;
  isBanned: boolean;
}

export interface Participant extends UserBase, ParticipantBase {
  media?: any;
}

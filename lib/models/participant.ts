import { Roles } from "../types";
import { IEntity } from "./entity";
import { IBaseUser, BaseUser } from "./user";

export interface IBaseParticipant extends IEntity {
  stream: string | null;
  role: Roles;
  isRaisingHand?: boolean;
  recvNodeId?: string;
  sendNodeId?: string;
}

export interface IParticipant extends IBaseUser, IBaseParticipant {}

export class Participant extends BaseUser implements IParticipant {
  role: Roles;
  stream: string | null;
  isRaisingHand?: boolean;
  recvNodeId?: string;
  sendNodeId?: string;

  constructor(data: IParticipant) {
    super(data);

    this.role = data.role;
    this.stream = data.stream;
    this.isRaisingHand = data.isRaisingHand;
  }

  static fromUser(user: BaseUser, role: Roles, stream: string): Participant {
    return new Participant({
      ...user,
      role,
      stream,
    });
  }
}

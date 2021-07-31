import { Roles } from "@app/types";
import { IBaseUser, BaseUser } from "./user";
import { IEntity } from "./entity";

export interface IBaseParticipant extends IEntity {
  stream: string;
  role: Roles;
  isRaisingHand?: boolean;
}

export interface IParticipant extends IBaseUser, IBaseParticipant {}

export class Participant extends BaseUser implements IParticipant {
  role: Roles;
  stream: string;
  isRaisingHand?: boolean;

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

import {IUser, User} from './user';
import {ParticipantRole} from '@app/types';

export interface IParticipant extends IUser {
  role: ParticipantRole;
}

export class Participant extends User implements IParticipant {
  role: ParticipantRole;

  constructor(data: IParticipant) {
    super(data);
    this.role = data.role;
  }

  static fromJSON(json: any): Participant {
    return new Participant({
      ...User.fromJSON(json),
      role: json.role,
    });
  }
}

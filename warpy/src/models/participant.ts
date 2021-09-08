import {IUser, User} from './user';
import {ParticipantRole} from '@app/types';

export interface IParticipant extends IUser {
  role: ParticipantRole;
  isRaisingHand?: boolean;
  isSpeaking?: boolean;
  volume: number;
}

export class Participant extends User implements IParticipant {
  role: ParticipantRole;
  isRaisingHand?: boolean;
  isSpeaking?: boolean;
  volume: number;

  constructor(data: IParticipant) {
    super(data);
    this.role = data.role;
    this.isRaisingHand = data.isRaisingHand;
    this.isSpeaking = false;
    this.volume = 0;
  }

  static fromJSON(json: any): Participant {
    return new Participant({
      ...User.fromJSON(json),
      role: json.role,
      isRaisingHand: false,
      isSpeaking: false,
      volume: 0,
    });
  }
}

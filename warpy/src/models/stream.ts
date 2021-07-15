import {IParticipant, Participant} from './participant';

export interface IStream {
  title: string;
  hub: string;
  participants: IParticipant[];
}

export class Stream implements IStream {
  title: string;
  hub: string;
  participants: Participant[];

  constructor(data: IStream) {
    this.title = data.title;
    this.hub = data.hub;
    this.participants = data.participants;
  }

  static fromJSON(json: any): Stream {
    return new Stream({
      title: json.title,
      hub: json.hub,
      participants: json.participants.map((p: any) => Participant.fromJSON(p)),
    });
  }
}

import {IParticipant, Participant} from './participant';

export interface IStream {
  id: string;
  title: string;
  hub: string;
  participants: IParticipant[];
}

export class Stream implements IStream {
  id: string;
  title: string;
  hub: string;
  participants: Participant[];

  constructor(data: IStream) {
    this.id = data.id;
    this.title = data.title;
    this.hub = data.hub;
    this.participants = data.participants;
  }

  static fromJSON(json: any): Stream {
    return new Stream({
      id: json.id,
      title: json.title,
      hub: json.hub,
      participants: json.participants.map((p: any) => Participant.fromJSON(p)),
    });
  }
}

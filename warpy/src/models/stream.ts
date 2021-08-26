import {IParticipant, Participant} from './participant';

export interface IStream {
  id: string;
  title: string;
  hub: string;
  preview: string;
  speakers: IParticipant[];
  participants: number;
}

export class Stream implements IStream {
  id: string;
  title: string;
  hub: string;
  speakers: Participant[];
  preview: string;
  participants: number;

  constructor(data: IStream) {
    this.id = data.id;
    this.title = data.title;
    this.hub = data.hub;
    this.speakers = data.speakers;
    this.preview = data.preview;
    this.participants = data.participants;
  }

  static fromJSON(json: any): Stream {
    return new Stream({
      id: json.id,
      title: json.title,
      hub: json.hub,
      speakers: json.speakers,
      preview: json.preview,
      participants: json.participants,
    });
  }
}

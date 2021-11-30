import {IParticipant, Participant} from './participant';

export interface IStream {
  id: string;
  title: string;
  hub: string;
  preview: string;
  speakers: IParticipant[];
  participants: number;
}

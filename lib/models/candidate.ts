import { Participant } from "./participant";

export interface IStream {
  id: string;
  owner: string;
  title: string;
  hub: string;
  preview: string | null;
}

export interface ICandidate extends IStream {
  participants: number;
  speakers: Participant[];
}

import { Participant } from "./participant";

export interface ICandidate {
  id: string;
  owner: string;
  title: string;
  hub: string;
  preview: string;
  participants: number;
  speakers: Participant[];
}

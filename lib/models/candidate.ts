import { Participant } from "./participant";

export interface ICandidate {
  id: string;
  owner: string;
  title: string;
  hub: string;
  preview: string | null;
  participants: number;
  speakers: Participant[];
}

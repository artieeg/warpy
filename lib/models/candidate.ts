//import { Participant } from "./participant";

import { Participant } from ".";

export interface Stream {
  id: string;
  owner: string | null;
  title: string;
  category: string;
  preview: string | null;
}

export interface Candidate extends Stream {
  total_participants: number;
  streamers: Participant[];
}

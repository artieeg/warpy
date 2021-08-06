import { IParticipant } from "./models";

export interface INewStreamResponse {
  stream: string;
  media: any;
  speakers: IParticipant[];
  count: number;
}

export interface IJoinStreamResponse {
  speakers: IParticipant[];
  raisedHands: IParticipant[];
  count: number;
}

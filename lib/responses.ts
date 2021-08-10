import { IParticipant, ICandidate, IBaseUser } from "./models";

export interface INewStreamResponse {
  stream: string;
  media: any;
  speakers: IParticipant[];
  count: number;
  mediaPermissionsToken: string;
}

export interface IJoinStreamResponse {
  speakers: IParticipant[];
  raisedHands: IParticipant[];
  count: number;
}

export interface IRequestViewersResponse {
  viewers: IParticipant[];
}

export interface IFeedResponse {
  feed: ICandidate[];
}

export interface IWhoAmIResponse {
  user: IBaseUser | null;
}

export interface INewUserResponse {
  id: string;
  access: string;
  refresh: string;
}

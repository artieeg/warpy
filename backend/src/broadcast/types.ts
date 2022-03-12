import { IAward } from '@warpy/lib';

export type MediaToggleEvent = {
  user: string;
  stream: string;
  videoEnabled?: boolean;
  audioEnabled?: boolean;
};

export type ChatMessageEvent = {
  idsToBroadcast: string[];
  message: string;
};

export type ReactionsEvent = {
  stream: string;
  reactions: any;
};

export type ActiveSpeakersEvent = {
  stream: string;
  activeSpeakers: { user: string; volume: number }[];
};

export type ParticipantLeaveEvent = {
  user: string;
  stream: string;
};

export type AwardSentEvent = {
  award: IAward;
};

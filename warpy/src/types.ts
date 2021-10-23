import {IParticipant} from '@warpy/lib';

export type MediaDirection = 'send' | 'recv';
export type ParticipantRole = 'streamer' | 'speaker' | 'viewer';

export interface IParticipantWithMedia extends IParticipant {
  media?: {
    audio?: {
      consumer: Consumer;
      track: MediaStream;
    };
    video?: {
      consumer: Consumer;
      track: MediaStream;
    };
  };
}

export type Modal =
  | 'user-actions'
  | 'participant-info'
  | 'participants'
  | 'reactions'
  | 'reports'
  | 'invite'
  | 'chat';

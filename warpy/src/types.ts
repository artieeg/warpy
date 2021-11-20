import {IParticipant} from '@warpy/lib';
import {Consumer} from 'mediasoup-client/lib/types';

export type MediaDirection = 'send' | 'recv';
export type ParticipantRole = 'streamer' | 'speaker' | 'viewer';

export interface IParticipantWithMedia extends IParticipant {
  media?: {
    audio?: {
      consumer: Consumer;
      track: MediaStream;
      active: boolean;
    };
    video?: {
      consumer: Consumer;
      track: MediaStream;
      active: boolean;
    };
  };
}

export type Modal =
  | 'user-actions'
  | 'award'
  | 'participant-info'
  | 'participants'
  | 'reactions'
  | 'reports'
  | 'invite'
  | 'stream-invite'
  | 'bot-confirm'
  | 'chat';

export type DURATION = 'LONG' | 'SHORT';

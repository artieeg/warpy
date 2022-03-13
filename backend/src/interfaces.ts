import { IUser } from '@warpy/lib';

export interface OnUserDisconnect {
  onUserDisconnect: (data: { user: string }) => Promise<any>;
}

export interface OnStreamEnd {
  onStreamEnd: (data: { stream: string }) => Promise<any>;
}

export interface OnParticipantLeave {
  onParticipantLeave: (data: { user: string }) => Promise<any>;
}

export interface OnNewUser {
  onNewUser: (data: { user: IUser }) => Promise<any>;
}

export interface OnInviteAccepted {
  onInviteAccepted: (data: {
    inviter: string;
    invited: string;
  }) => Promise<any>;
}

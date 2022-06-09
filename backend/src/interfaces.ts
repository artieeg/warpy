import { IParticipant, IStream, IUser } from '@warpy/lib';

export interface OnUserDisconnect {
  onUserDisconnect: (data: { user: string }) => Promise<any>;
}

export interface OnStreamEnd {
  onStreamEnd: (data: { stream: string }) => Promise<any>;
}

export interface OnParticipantLeave {
  onParticipantLeave: (data: { user: string; stream: string }) => Promise<any>;
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

export interface OnNewParticipant {
  onNewParticipant: (data: { participant: IParticipant }) => Promise<any>;
}

export interface OnUserConnect {
  onUserConnect: (data: { user: string }) => Promise<any>;
}

export interface OnRoleChange {
  onRoleChange: (data: { participant: IParticipant }) => Promise<any>;
}

export interface OnViewerUpgraded {
  onViewerUpgraded: (data: { participant: IParticipant }) => Promise<any>;
}

export interface OnStreamerDowngradeToViewer {
  onStreamerDowngradeToViewer: (data: {
    participant: IParticipant;
  }) => Promise<any>;
}

export interface OnParticipantRejoin {
  onParticipantRejoin: (data: { participant: IParticipant }) => Promise<any>;
}

export interface OnHostReassignFailed {
  onHostReassignFailed: (data: { stream: string }) => Promise<any>;
}

export interface OnHostReassign {
  onHostReassign: (data: {
    stream: string;
    host: IParticipant;
  }) => Promise<any>;
}

export interface OnNewStream {
  onNewStream: (data: {
    stream: IStream;
    hostNodeIds: {
      sendNodeId: string;
      recvNodeId: string;
    };
  }) => Promise<any>;
}

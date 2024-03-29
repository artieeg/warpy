import { Participant, Stream, User } from '@warpy/lib';

export interface OnUserDisconnect {
  onUserDisconnect: (data: { user: string }) => Promise<any>;
}

export interface OnStreamEnd {
  onStreamEnd: (data: { stream: string }) => Promise<any>;
}

export interface OnParticipantKicked {
  onParticipantKicked: (data: Participant) => Promise<any>;
}

export interface OnParticipantLeave {
  onParticipantLeave: (data: { user: string; stream: string }) => Promise<any>;
}

export interface OnNewUser {
  onNewUser: (data: { user: User }) => Promise<any>;
}

export interface OnInviteAccepted {
  onInviteAccepted: (data: {
    inviter: string;
    invited: string;
  }) => Promise<any>;
}

export interface OnNewParticipant {
  onNewParticipant: (data: { participant: Participant }) => Promise<any>;
}

export interface OnUserConnect {
  onUserConnect: (data: { user: string }) => Promise<any>;
}

export interface OnRoleChange {
  onRoleChange: (data: { participant: Participant }) => Promise<any>;
}

export interface OnViewerUpgraded {
  onViewerUpgraded: (data: { participant: Participant }) => Promise<any>;
}

export interface OnStreamerDowngradeToViewer {
  onStreamerDowngradeToViewer: (data: {
    participant: Participant;
  }) => Promise<any>;
}

export interface OnParticipantRejoin {
  onParticipantRejoin: (data: { participant: Participant }) => Promise<any>;
}

export interface OnHostReassignFailed {
  onHostReassignFailed: (data: { stream: string }) => Promise<any>;
}

export interface OnHostReassign {
  onHostReassign: (data: { stream: string; host: Participant }) => Promise<any>;
}

export interface OnNewStream {
  onNewStream: (data: {
    stream: Stream;
    hostNodeIds: {
      sendNodeId: string;
      recvNodeId: string;
    };
  }) => Promise<any>;
}

export interface OnNewReaction {
  onNewReaction: (data: { reaction: string; stream: string }) => Promise<any>;
}

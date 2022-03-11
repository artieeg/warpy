export interface OnUserDisconnect {
  onUserDisconnect: (data: { user: string }) => Promise<any>;
}

export interface OnStreamEnd {
  onStreamEnd: (data: { stream: string }) => Promise<any>;
}

export interface OnParticipantLeave {
  onParticipantLeave: (data: { user: string }) => Promise<any>;
}

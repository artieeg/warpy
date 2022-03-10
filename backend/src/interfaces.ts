export interface OnUserDisconnect {
  onUserDisconnect: (data: { user: string }) => Promise<any>;
}

export interface OnStreamEnd {
  onStreamEnd: (data: { stream: string }) => Promise<any>;
}

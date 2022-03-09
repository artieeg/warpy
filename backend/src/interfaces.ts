export interface OnUserDisconnectEventHandler {
  onUserDisconnect: (data: { user: string }) => Promise<any>;
}

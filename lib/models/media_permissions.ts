export interface IMediaPermissions {
  user: string;
  room: string;
  video: boolean;
  audio: boolean;
  sendNodeId?: string;
  recvNodeId: string;
}

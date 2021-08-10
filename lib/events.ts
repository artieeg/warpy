import { IMediaPermissions } from "./models";

export interface ISpeakingAllowedEvent {
  stream: string;
  media: any;
  mediaPermissionToken: IMediaPermissions;
}

import { IMediaPermissions } from "@lib/models";

export interface ISpeakingAllowedEvent {
  stream: string;
  media: any;
  mediaPermissionToken: IMediaPermissions;
}

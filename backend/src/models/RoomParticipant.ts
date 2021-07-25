import { Roles } from "@app/types";

export interface IRoomParticipant {
  id: string;
  stream: string;
  role?: Roles;
}

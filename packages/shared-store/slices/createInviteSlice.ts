import { IAppInvite, ISentInvite } from "@warpy/lib";
import { StoreSlice } from "../types";

export interface IInviteSlice {
  pendingInviteUserIds: string[];
  sentInvites: Record<string, ISentInvite>;
  appInvite: IAppInvite | null;
}

export const createInviteSlice: StoreSlice<IInviteSlice> = () => ({
  pendingInviteUserIds: [],
  sentInvites: {},
  appInvite: null,
});

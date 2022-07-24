import { AppInvite, ISentInvite } from "@warpy/lib";
import { StoreSlice } from "../types";

export interface IInviteSlice {
  pendingInviteUserIds: string[];
  sentInvites: Record<string, ISentInvite>;
  appInvite: AppInvite | null;
}

export const createInviteSlice: StoreSlice<IInviteSlice> = () => ({
  pendingInviteUserIds: [],
  sentInvites: {},
  appInvite: null,
});

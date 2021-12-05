import { IAppInvite, IInvite } from "@warpy/lib";
import { StoreSlice } from "../types";

export interface IInviteSlice {
  pendingInviteUserIds: string[];
  sentInvites: Record<string, IInvite>;
  appInvite: IAppInvite | null;
}

export const createInviteSlice: StoreSlice<IInviteSlice> = () => ({
  pendingInviteUserIds: [],
  sentInvites: {},
  appInvite: null,
});

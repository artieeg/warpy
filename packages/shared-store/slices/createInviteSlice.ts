import { AppInvite, InviteSent, User } from "@warpy/lib";
import { StoreSlice } from "../types";

export interface IInviteSlice {
  pendingInviteUserIds: string[];
  inviteSuggestions: User[];
  sentInvites: Record<string, InviteSent>;
  appInvite: AppInvite | null;
}

export const createInviteSlice: StoreSlice<IInviteSlice> = () => ({
  pendingInviteUserIds: [],
  inviteSuggestions: [],
  sentInvites: {},
  appInvite: null,
});

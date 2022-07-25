import { UserBase, User, Roles } from "@warpy/lib";
import { StoreSlice } from "../types";

export interface IUserSlice {
  user: UserBase | null;
  role: Roles | null;
  isLoadingUser: boolean;
  exists: boolean;
  following: string[];
  isRaisingHand: boolean;
  hasActivatedAppInvite: boolean;
  userSearchResult: User[];
  isSearchingUsers: boolean;
}

export const createUserSlice: StoreSlice<IUserSlice> = () => ({
  isRaisingHand: false,
  user: null,
  role: null,
  isLoadingUser: true,
  exists: false,
  following: [],
  hasActivatedAppInvite: false,
  userSearchResult: [],
  isSearchingUsers: false,
});

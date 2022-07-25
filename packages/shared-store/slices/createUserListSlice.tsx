import { User } from "@warpy/lib";
import { StoreSlice } from "../types";

type UserList = {
  page: number;
  list: User[];
};

export interface IUserListSlice {
  list_blocked: UserList;
  list_following: UserList;
  list_followers: UserList;
}

export const createUserListSlice: StoreSlice<IUserListSlice> = () => ({
  list_blocked: {
    page: 0,
    list: [],
  },
  list_followers: {
    page: 0,
    list: [],
  },
  list_following: {
    page: 0,
    list: [],
  },
});

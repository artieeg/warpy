import { IStream, IUser } from "@backend/dal";

export const createStreamFixture = (data: Partial<IStream>): IStream => {
  return {
    id: "test-id",
    owner: "test owner",
    hub: "hub",
    title: "test",
    ...data,
  };
};

export const createUserFixture = (data: Partial<IUser>): IUser => {
  return {
    id: "test-id",
    last_name: "test",
    first_name: "test",
    avatar: "avatar.com/test",
    email: null,
    sub: null,
    username: "test_username",
    ...data,
  };
};
